import type { $Typed, AppBskyEmbedExternal, AppBskyFeedDefs } from "@atproto/api";

export function isExternalEmbed(embed: AppBskyFeedDefs.PostView["embed"]): embed is $Typed<AppBskyEmbedExternal.View> {
	return embed?.$type === "app.bsky.embed.external#view";
}

export async function getRecord<T>(pdsUrl: string, uri: string) {
	const sp = new URLSearchParams();
	const [did, collection, rkey] = uri.slice("at://".length).split("/");
	if (did == null || collection == null || rkey == null) return null;
	sp.set("repo", did);
	sp.set("collection", collection);
	sp.set("rkey", rkey);
	const res = await fetch(`${pdsUrl}/xrpc/com.atproto.repo.getRecord?${sp.toString()}`);
	if (!res.ok) return null;
	return (await res.json()).value as T;
}
