import type { $Typed, AppBskyEmbedExternal, AppBskyFeedDefs } from "@atproto/api";
import { isValidElement, useMemo } from "react";
import { useLoader } from "../lib/contexts/loader";
import type { Units } from "../loader/types";
import { generateDefaultUnitArgs } from "../loader/util";

export function EmbedWrapper({ post }: { post: AppBskyFeedDefs.PostView }) {
	const loader = useLoader();
	const embed = useMemo(() => getEmbed(post, loader.units.embed), [post, loader.units.embed]);
	console.log(isExternalEmbed(post.embed));
	return <>{embed}</>;
}

function getEmbed(post: AppBskyFeedDefs.PostView, embedUnits: Units["embed"]): React.ReactNode {
	const defaultUnitArgs = generateDefaultUnitArgs();
	for (const Unit of embedUnits) {
		const rendered = Unit({ post, ...defaultUnitArgs });
		if (isValidElement(rendered)) return rendered;
	}
	return null;
}

function isExternalEmbed(embed: AppBskyFeedDefs.PostView["embed"]): embed is $Typed<AppBskyEmbedExternal.View> {
	return embed?.$type === "app.bsky.embed.external#view";
}
