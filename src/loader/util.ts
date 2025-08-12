import { Agent, AtUri, type ComAtprotoRepoGetRecord } from "@atproto/api";
import {getHandle, getPdsEndpoint, isValidDidDoc} from "@atproto/common-web";
import {DidResolver,MemoryCache} from "@atproto/identity"

import { WinTomoXAtunitsUnit as UnitRecord } from "../lexicons";
import { DEFAULT_UNIT_URIS, REACT_VER, UNIT_KEYS, UNIT_URIS_KEY, UNIT_VERS } from "./const";
import { type SavedUnitUris, type UnitDefaultArgs, UnitLoadFailedError, type Units, type UnitUris } from "./types";
import * as JSXNS from "react/jsx-runtime";
import React from "react";

const didResolver=new DidResolver({didCache: new MemoryCache()});
async function resolveDidToPds(did: string) {
	const res = await didResolver.resolve(did,)
	if(res==null)throw new Error(`Failed to resolve DID: ${did}`);
	const pds=getPdsEndpoint(res)
	const handle=getHandle(res);
	if (!pds) throw new Error("No PDS endpoint found in DID document");
	if (typeof pds !== "string") throw new Error("PDS endpoint is not a string");
	return { pds, handle };
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
		const result = {} as UnitUris;
		for (const key of UNIT_KEYS) {
			result[key] = parsed[key] ? new AtUri(parsed[key]) : DEFAULT_UNIT_URIS[key];
		}
		return result;
	} catch (e) {
		console.error("Failed to load unit config from localStorage", e);
		return DEFAULT_UNIT_URIS;
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
