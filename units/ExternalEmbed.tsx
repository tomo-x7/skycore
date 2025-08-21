import type { UnitArgs } from "./type";
import { isExternalEmbed } from "./util";

export default function ExternalEmbed({ post, React }: UnitArgs["embed"]) {
	if (!isExternalEmbed(post.embed)) return null;
	return (
		<div>
			{post.embed.external.thumb && (
				<div style={{ aspectRatio: "1.91 / 1" }}>
					<img style={{ objectFit: "cover" }} src={post.embed.external.thumb} />
				</div>
			)}
		</div>
	);
}
