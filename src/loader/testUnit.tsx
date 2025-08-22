import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { UnitList } from "../../units/config";
import { type Unit, type UnitDefaultArgs, UnitLoadFailedError } from "./types";
import { generateDefaultUnitArgs } from "./util";

export async function testUnit<K extends keyof UnitList, T extends object>(
	key: K,
	Unit: Unit<T & UnitDefaultArgs>,
	args: T,
	skip: boolean,
	testSec = 10,
) {
	if (skip)
		return new Promise<void>((resolve, reject) => {
			if (typeof Unit !== "function") reject(new UnitLoadFailedError(key, "test", "Unit is not a function"));
			resolve();
		});

	return new Promise<void>((resolve, rejectInner) => {
		const timer = setTimeout(() => resolve(), testSec * 1000);
		const reject = (e: unknown) => {
			clearTimeout(timer);
			rejectInner(new UnitLoadFailedError(key, "test", String(e)));
		};
		try {
			const el = document.createElement("div");

			// const args=UNIT_TEST_ARGS[key];
			createRoot(el, { onUncaughtError: reject, onCaughtError: reject, onRecoverableError: reject }).render(
				<StrictMode>
					<Unit {...args} {...generateDefaultUnitArgs()} />
				</StrictMode>,
			);
		} catch (e) {
			rejectInner(new UnitLoadFailedError(key, "test", String(e)));
		}
	});
}
