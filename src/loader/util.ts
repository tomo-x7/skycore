import { AtUri, type ComAtprotoRepoGetRecord } from "@atproto/api";
import { getHandle, getPdsEndpoint } from "@atproto/common-web";
import { DidResolver, MemoryCache } from "@atproto/identity";
import React from "react";
import { isMultiUnit, type MultiUnitList, UNIT_KEYS, type UnitList } from "../../units/config";
import { WinTomoXAtunitsUnit as UnitRecord } from "../lexicons";
import { DEFAULT_UNIT_URIS, REACT_VER, UNIT_URIS_KEY, UNIT_VERS } from "./const";
import { testUnit } from "./testUnit";
import {
	type logger,
	type MultiUnitUris,
	type SavedUnitUris,
	type SingleUnitUris,
	type Unit,
	type UnitConfig,
	type UnitDefaultArgs,
	UnitLoadFailedError,
	type UnitModule,
	type Units,
	type UnitUris,
} from "./types";

const didResolver = new DidResolver({ didCache: new MemoryCache(), timeout: 10 * 1000 });
async function resolveDidToPds(did: string) {
	const res = await didResolver.resolve(did);
	if (res == null) throw new Error(`Failed to resolve DID: ${did}`);
	const pds = getPdsEndpoint(res);
	const handle = getHandle(res);
	if (!pds) throw new Error("No PDS endpoint found in DID document");
	if (typeof pds !== "string") throw new Error("PDS endpoint is not a string");
	return { pds, handle };
}

export async function loadUnit<K extends keyof Units, T extends object>(
	key: K,
	uri: AtUri,
	registerUnit: (unit: Unit<T & UnitDefaultArgs>) => void,
	registerCss: (url: string[]) => void,
	skipTest: boolean,
	testArgs: T,
	testSec: number,
	log: logger,
	registerTest: (promise: Promise<unknown>) => void,
) {
	const record = await loadUnitRecord(key, uri);
	const validateResult = validateUnitRecord(key, record);
	if (validateResult.result === "warn") log(`[warn][${key}] ${validateResult.message}`);
	const unitModule: UnitModule<T> = await import(/* @vite-ignore */ record.src);
	const testPromise = testUnit<K, T>(key, unitModule.default, testArgs, skipTest, testSec);
	registerTest(testPromise);
	registerUnit(unitModule.default);
	registerCss(loadUnitCSS(new URL(record.src), unitModule.config?.css));
}
export async function loadMultiUnit<K extends keyof Units, T extends object>(
	key: K,
	uris: AtUri[],
	registerUnit: (unit: Unit<T & UnitDefaultArgs>) => void,
	registerCss: (url: string[]) => void,
	skipTest: boolean,
	testArgs: T,
	testSec: number,
	log: logger,
	registerTest: (promise: Promise<unknown>) => void,
) {
	for (const uri of uris) {
		await loadUnit(key, uri, registerUnit, registerCss, skipTest, testArgs, testSec, log, registerTest);
	}
}

export async function loadUnitRecord(key: keyof Units, uri: AtUri): Promise<UnitRecord.Record> {
	try {
		if (uri.collection !== "win.tomo-x.atunits.unit") throw new Error("Invalid collection");
		const { pds } = await resolveDidToPds(uri.host);
		const sp = new URLSearchParams();
		sp.set("repo", uri.host);
		sp.set("collection", uri.collection);
		sp.set("rkey", uri.rkey);
		const res = await fetch(new URL(`/xrpc/com.atproto.repo.getRecord?${sp.toString()}`, pds));
		if (!res.ok) throw new Error(`Failed to fetch record: ${res.status} ${res.statusText} ${await res.text()}`);
		const raw = (await res.json()) as ComAtprotoRepoGetRecord.Response["data"];
		const result = UnitRecord.validateRecord(raw.value);
		if (!result.success) throw new Error(`Invalid record: ${result.error.message}`);
		return result.value;
	} catch (e) {
		throw new UnitLoadFailedError(key, "loadRecord", String(e));
	}
}

export function loadUnitConfig(): UnitUris {
	try {
		const saved = localStorage.getItem(UNIT_URIS_KEY);
		if (!saved) return DEFAULT_UNIT_URIS;
		const parsed = JSON.parse(saved) as SavedUnitUris;
		const multiResult = {} as MultiUnitUris;
		const singleResult = {} as SingleUnitUris;
		for (const key of UNIT_KEYS) {
			if (isKeyMultiUnit(key)) {
				multiResult[key] = parseMultiUnitUris(parsed[key]) ?? DEFAULT_UNIT_URIS[key];
			} else {
				singleResult[key] = parsed[key] ? new AtUri(parsed[key]) : DEFAULT_UNIT_URIS[key];
			}
		}
		return { ...multiResult, ...singleResult };
	} catch (e) {
		console.error("Failed to load unit config from localStorage", e);
		return DEFAULT_UNIT_URIS;
	}
}
export function isKeyMultiUnit(key: keyof UnitList): key is keyof MultiUnitList {
	return isMultiUnit[key] === true;
}
function parseMultiUnitUris(uris: string | undefined) {
	if (uris == null) return null;
	try {
		return uris.split(",").map((uri) => new AtUri(uri.trim()));
	} catch (e) {
		return null;
	}
}

export function updateUnitConfig(key: keyof UnitUris, uri: AtUri) {}

export function validateUnitRecord(
	key: keyof Units,
	record: UnitRecord.Record,
): { result: "ok" } | { result: "warn"; message: string } {
	const result = UnitRecord.validateRecord(record);
	if (result.success === false)
		throw new UnitLoadFailedError(key, "loadRecord", `Invalid record: ${result.error.message}`);
	if (validateLibVer(record.libver, key) === false) return { result: "warn", message: "libver mismatch" };
	if (record.target.includes(UNIT_VERS[key]) === false) return { result: "warn", message: "target mismatch" };

	return { result: "ok" };
}

function validateLibVer(recordVer: string[], key: keyof Units): boolean {
	const [lib, libVer] = REACT_VER.split("@");
	// バージョン指定なしのlib一致
	if (recordVer.includes(lib)) return true;
	// lib不一致
	if (recordVer.findIndex((v) => v.startsWith(lib)) === -1)
		throw new UnitLoadFailedError(key, "loadRecord", `lib mismatch: ${lib}`);
	for (const ver of recordVer.filter((v) => v.startsWith(lib)).map((v) => v.split("@")[1])) {
		if (libVer.startsWith(ver)) return true;
	}
	return false;
}

export function generateDefaultUnitArgs(): UnitDefaultArgs {
	return {
		React: React,
		fetcher: globalThis.fetcher,
	};
}

export function loadUnitCSS(srcUrl: URL, cssConfig?: UnitConfig["css"]) {
	try {
		if (cssConfig == null) return [];
		if (Array.isArray(cssConfig))
			return cssConfig.map((url) => parseCSSUrl(srcUrl, url)).filter((url) => url != null);
		if (typeof cssConfig === "function") {
			return cssConfig(srcUrl)
				.map((url) => parseCSSUrl(srcUrl, url))
				.filter((url) => url != null);
		}
	} catch (e) {
		console.warn("Failed to load unit CSS", e);
	}
	return [];
}

function parseCSSUrl(srcUrl: URL, cssUrl: string | URL) {
	try {
		if (typeof cssUrl === "string") return new URL(cssUrl, srcUrl).toString();
		if (typeof cssUrl === "object" && cssUrl instanceof URL) return cssUrl.toString();
	} catch (e) {
		console.warn("Failed to parse CSS URL", cssUrl, "from", srcUrl, e);
	}
	return null;
}

export function loadCSSs(urls: string[]) {
	const elements: HTMLLinkElement[] = [];
	for (const url of urls) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = url;
		elements.push(link);
	}
	document.head.append(...elements);
}
