import type { $Typed, AppBskyEmbedExternal, AppBskyFeedDefs } from "@atproto/api";

export function isExternalEmbed(embed: AppBskyFeedDefs.PostView["embed"]): embed is $Typed<AppBskyEmbedExternal.View> {
	return embed?.$type === "app.bsky.embed.external#view";
}
