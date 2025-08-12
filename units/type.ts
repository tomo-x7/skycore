import { AppBskyFeedDefs } from "@atproto/api";
import { Fetcher } from "../src/fetcher";
import React from "react";

export type UnitDefaultArgs = {
	React: typeof React;
	fetcher: Fetcher;
};
export type RawUnitArgs = {
	TLPost: { post: AppBskyFeedDefs.PostView; isReply?: boolean; hasReply?: boolean; longReply?: boolean };
};
export type UnitArgs = { [K in keyof RawUnitArgs]: RawUnitArgs[K] & UnitDefaultArgs };