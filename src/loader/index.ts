import type { AtUri } from "@atproto/api";
import { UNIT_KEYS } from "./const";
import { testUnit } from "./testUnit";
import { type Loader, UnitLoadFailedError, type UnitModule, type Units, type UnitUris } from "./types";
import { loadCSSs, loadUnitConfig, loadUnitCSS, loadUnitRecord, validateUnitRecord } from "./util";

export const loader: Loader = {
	_units: undefined,
	_unitUris: undefined,
	get units(): Units {
		if (this._units == null) throw new Error("Units not loaded");
		return this._units;
	},
	get unitUris(): UnitUris {
		if (this._unitUris == null) throw new Error("Unit URIs not loaded");
		return this._unitUris;
	},
	async loadUnits(log: (message: string) => void): Promise<boolean> {
		const unitUris = loadUnitConfig();
		this._unitUris = unitUris;
		const units = {} as Units;
		let success = true;
		const cssUrls: string[] = [];
		for (const key of UNIT_KEYS) {
			try {
				const record = await loadUnitRecord(key, unitUris[key]);
				const validateResult = validateUnitRecord(key, record);
				if (validateResult.result === "warn") log(`[warn][${key}] ${validateResult.message}`);
				const unitModule: UnitModule<typeof key> = await import(/* @vite-ignore */ record.src).then(
					(mod) => mod,
				);
				await testUnit(key, unitModule.default, true);
				units[key] = unitModule.default;
				cssUrls.push(...loadUnitCSS(new URL(record.src), unitModule.config?.css));
			} catch (e) {
				success = false;
				if (e instanceof UnitLoadFailedError) {
					log(`[error][${e.key}][${e.context}] ${e.message}`);
				} else {
					log(`[error][${key}][unknown] ${String(e)}`);
				}
			}
		}
		if (!success) return false;
		this._units = units;
		loadCSSs(cssUrls);
		return success;
	},
	async updateUnit(key: keyof Units, newUri: AtUri, log: (message: string) => void): Promise<boolean> {
		let success = true;
		try {
			const record = await loadUnitRecord(key, newUri);
			const validateResult = validateUnitRecord(key, record);
			if (validateResult.result === "warn") log(`[warn][${key}] ${validateResult.message}`);
			const unit = await import(record.src).then((mod) => mod.default);
			await testUnit(key, unit, false);
		} catch (e) {
			success = false;
			if (e instanceof UnitLoadFailedError) {
				log(`[error][${e.key}][${e.context}] ${e.message}`);
			} else {
				log(`[error][${key}][unknown] ${String(e)}`);
			}
		}
		throw new Error("Function not implemented.");
	},
	loadUnitUris(): void {
		this._unitUris = loadUnitConfig();
	},
};
