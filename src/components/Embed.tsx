import type { AppBskyFeedDefs } from "@atproto/api";
import { useMemo } from "react";
import { useLoader } from "../lib/contexts/loader";
import type { Units } from "../loader/types";
import { generateDefaultUnitArgs } from "../loader/util";

export function EmbedWrapper({ post }: { post: AppBskyFeedDefs.PostView }) {
	const loader = useLoader();
	const embed = useMemo(() => getEmbed(post, loader.units.embed), [post, loader.units.embed]);
	return <>{embed}</>;
}

function getEmbed(post: AppBskyFeedDefs.PostView, embedUnits: Units["embed"]): React.ReactNode {
	const defaultUnitArgs = generateDefaultUnitArgs();
	for (const Unit of embedUnits) {
		const rendered = <Unit post={post} {...defaultUnitArgs} />;
		if (rendered != null) return rendered;
	}
	return null;
}
