import { MULTI_UNIT_KEYS, SINGLE_UNIT_KEYS } from "../../units/config";
import { UNIT_TEST_ARGS } from "./testArgs";
import {
	type Loader,
	type logger,
	type MultiUnits,
	type SingleUnits,
	UnitLoadFailedError,
	type Units,
	type UnitUris,
} from "./types";
import { loadCSSs, loadMultiUnit, loadUnit, loadUnitConfig } from "./util";

export function createLoader(): Loader {
	let units: Units | null = null;
	const unitUris = loadUnitConfig();
	const loadUnitsInner = async (log: logger, skipTest: boolean, loadUnitUris: UnitUris = unitUris) => {
		const singleUnit = {} as SingleUnits;
		const multiUnit = {} as MultiUnits;
		const cssUrls: string[] = [];
		const promises: Promise<unknown>[] = [];
		const registerCss = (urls: string[]) => cssUrls.push(...urls);
		try {
			for (const key of SINGLE_UNIT_KEYS) {
				const p = loadUnit(
					key,
					loadUnitUris[key],
					(unit) => {
						singleUnit[key] = unit;
					},
					registerCss,
					skipTest,
					UNIT_TEST_ARGS[key],
					log,
				);
				promises.push(p);
			}
			for (const key of MULTI_UNIT_KEYS) {
				multiUnit[key] = [];
				const p = loadMultiUnit(
					key,
					loadUnitUris[key],
					(unit) => {
						multiUnit[key].push(unit);
					},
					registerCss,
					skipTest,
					UNIT_TEST_ARGS[key],
					log,
				);
				promises.push(p);
			}
			await Promise.all(promises);
			loadCSSs(cssUrls);
			units = { ...singleUnit, ...multiUnit };
			return true;
		} catch (e) {
			if (e instanceof UnitLoadFailedError) {
				log(`[error][${e.key}][${e.context}] ${e.message}`);
			} else {
				log(`[error][unknown] ${String(e)}`);
			}
			return false;
		}
	};

	return {
		get units() {
			if (units == null) throw new Error("Units not loaded");
			return units;
		},
		unitUris,
		loadUnits: (log: logger): Promise<boolean> => loadUnitsInner(log, false),
		updateUnit: async (unitUris: UnitUris, log: logger): Promise<boolean> => {
			const success = await loadUnitsInner(log, false, unitUris);
			if (success === false) return false;
			throw new Error("Function not implemented.");
		},
	};
}
