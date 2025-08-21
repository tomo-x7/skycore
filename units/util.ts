import type { AppBskyEmbedExternal } from "@atproto/api";

export function isExternalEmbed(embed: any): embed is AppBskyEmbedExternal.View {
	return embed?.$type === "app.bsky.embed.external";
}
