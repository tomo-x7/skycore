import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UNIT_TEST_ARGS } from "./testArgs";
import { UnitLoadFailedError, type Units } from "./types";
import { generateDefaultUnitArgs } from "./util";

export async function testUnit<K extends keyof Units>(key: K, Unit: Units[K], skip: boolean) {
	if (skip)
		return new Promise<void>((resolve, reject) => {
			if (typeof Unit !== "function") reject(new UnitLoadFailedError(key, "test", "Unit is not a function"));
			resolve();
		});
	return new Promise<void>((resolve, rejectInner) => {
		const timer = setTimeout(() => resolve(), 10 * 1000);
		const reject = (e: unknown) => {
			clearTimeout(timer);
			rejectInner(new UnitLoadFailedError(key, "test", String(e)));
		};
		try {
			const el = document.createElement("div");
			// const args=UNIT_TEST_ARGS[key];
			createRoot(el, { onUncaughtError: reject, onCaughtError: reject, onRecoverableError: reject }).render(
				<StrictMode>
					<Unit {...generateDefaultUnitArgs()} {...(UNIT_TEST_ARGS[key] as any)} />
				</StrictMode>,
			);
		} catch (e) {
			rejectInner(new UnitLoadFailedError(key, "test", String(e)));
		}
	});
}
