import type { UnitArgs, UnitDefaultArgs } from "./type";
import { isExternalEmbed } from "./util";

export default function YoutubeEmbed({ React, fetcher, post }: UnitArgs["embed"]): React.ReactNode {
	try {
		if (!isExternalEmbed(post.embed)) return null;

		const uri = new URL(post.embed.external.uri);
		if (uri.host === "www.youtube.com" || uri.host === "youtube.com")
			return <YoutubeEmbedInner React={React} v={uri.searchParams.get("v")} />;
		if (uri.host === "youtu.be") return <YoutubeEmbedInner React={React} v={uri.pathname.slice(1)} />;
		return null;
	} catch (e) {
		console.error("YoutubeEmbed error:", e);
		return null;
	}
}

function YoutubeEmbedInner({ v, React }: { v: string | null } & { React: UnitDefaultArgs["React"] }) {
	console.log(`render youtube ${v}`);
	if (v == null) return null;
	return (
		<iframe
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
			frameBorder="0"
			height="315"
			referrerPolicy="strict-origin-when-cross-origin"
			src={`https://www.youtube.com/embed/${v}`}
			title="YouTube video player"
			width="560"
		/>
	);
}
