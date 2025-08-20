import type React from "react";
import type { Fetcher } from "../src/fetcher";
import type { UnitList } from "./config";

export type UnitDefaultArgs = {
	React: typeof React;
	fetcher: Fetcher;
};
export type RawUnitArgs = { [K in keyof UnitList]: UnitList[K] };
export type UnitArgs = { [K in keyof UnitList]: UnitList[K] & UnitDefaultArgs };

export type UnitConfig = {
	css?: (string | URL)[] | ((url: URL) => (string | URL)[]);
};

type inferArgs<T extends object | object[]> = T extends Array<infer U> ? U : T;
