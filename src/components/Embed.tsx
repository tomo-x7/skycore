import { AppBskyFeedDefs } from "@atproto/api";
import { useLoader } from "../lib/contexts/loader";
import { generateDefaultUnitArgs } from "../loader/util";
import { Units } from "../loader/types";
import { useMemo } from "react";

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
