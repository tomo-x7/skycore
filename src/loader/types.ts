import type { AppBskyFeedDefs, AtUri } from "@atproto/api";
import type React from "react";
import type { Fetcher } from "../fetcher";
import type { UNIT_KEYS } from "./const";
import * as JSXNS from "react/jsx-runtime";
import { UnitArgs } from "../../units/type";
export type * from "../../units/type"
export interface Loader {
	_units: Units | undefined;
	_unitUris: UnitUris | undefined;
	units: Units;
	unitUris: UnitUris;
	loadUnits: (log: (message: string) => void) => Promise<boolean>;
	loadUnitUris: () => void;
	updateUnit: (key: keyof Units, newUri: AtUri, log: (message: string) => void) => Promise<boolean>;
}

export type UnitUris = {
	[key in (typeof UNIT_KEYS)[number]]: AtUri;
};
export type SavedUnitUris = {
	[key in (typeof UNIT_KEYS)[number]]?: string;
};
export type Unit<T> = React.FC<T>;


export type Units = {
	[K in keyof UnitArgs]: Unit<UnitArgs[K]>;
};

export class UnitLoadFailedError extends Error {
	constructor(
		public key: keyof Units,
		public context: "loadRecord" | "loadSrc" | "test",
		public message: string,
	) {
		super(message);
	}
}
