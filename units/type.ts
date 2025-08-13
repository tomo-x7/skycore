import type { AppBskyFeedDefs } from "@atproto/api";
import type React from "react";
import type { Fetcher } from "../src/fetcher";

export type UnitDefaultArgs = {
	React: typeof React;
	fetcher: Fetcher;
};
export type RawUnitArgs = {
	TLPost: { post: AppBskyFeedDefs.PostView; isReply?: boolean; hasReply?: boolean; longReply?: boolean };
};
export type UnitArgs = { [K in keyof RawUnitArgs]: RawUnitArgs[K] & UnitDefaultArgs };

export type UnitConfig = {
	css?: (string|URL)[] | ((url: URL) => (string|URL)[]);
};
