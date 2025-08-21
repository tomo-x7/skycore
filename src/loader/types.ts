import type { AtUri } from "@atproto/api";
import type React from "react";
import type { MultiUnitList, SingleUnitList, UnitList } from "../../units/config";
import type { UnitArgs, UnitConfig, UnitDefaultArgs } from "../../units/type";

export type * from "../../units/type";
export interface Loader {
	units: Units;
	unitUris: UnitUris;
	loadUnits: (log: (message: string) => void) => Promise<boolean>;
	updateUnit: (unitUris: UnitUris, log: (message: string) => void) => Promise<boolean>;
}

export type UnitUris = SingleUnitUris & MultiUnitUris;
export type SingleUnitUris = {
	[key in keyof SingleUnitList]: AtUri;
};
export type MultiUnitUris = {
	[key in keyof MultiUnitList]: AtUri[];
};

export type SavedUnitUris = {
	[key in keyof UnitList]?: string;
};
export type Unit<T> = React.FC<T>;

export type Units = SingleUnits & MultiUnits;
export type SingleUnits = {
	[K in keyof SingleUnitList]: Unit<UnitArgs[K]>;
};
export type MultiUnits = {
	[K in keyof MultiUnitList]: Unit<UnitArgs[K]>[];
};
export class UnitLoadFailedError extends Error {
	constructor(
		public key: keyof UnitList,
		public context: "loadRecord" | "loadSrc" | "test",
		public message: string,
	) {
		super(message);
	}
}

export type UnitModule<T extends object> = {
	default: Unit<T & UnitDefaultArgs>;
	config?: UnitConfig;
};
export type logger = (message: string) => void;
