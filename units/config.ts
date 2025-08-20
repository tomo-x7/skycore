import type { AppBskyFeedDefs } from "@atproto/api";

export const isMultiUnit = {
	TLPost: false,
	embed: true,
} satisfies Readonly<{ [key in keyof SingleUnitList]: false } & { [key in keyof MultiUnitList]: true }>;
export const SINGLE_UNIT_KEYS = ["TLPost"] satisfies ReadonlyArray<keyof SingleUnitList>;
export const MULTI_UNIT_KEYS = ["embed"] satisfies ReadonlyArray<keyof MultiUnitList>;
export const UNIT_KEYS = [...SINGLE_UNIT_KEYS, ...MULTI_UNIT_KEYS] satisfies ReadonlyArray<
	keyof SingleUnitList | keyof MultiUnitList
>;

export type UnitList = SingleUnitList & MultiUnitList;
export type SingleUnitList = {
	TLPost: { post: AppBskyFeedDefs.PostView; isReply?: boolean; hasReply?: boolean; longReply?: boolean };
};

export type MultiUnitList = {
	embed: { uri: string };
};
