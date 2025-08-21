import type { UnitArgs } from "./type";
import { isExternalEmbed } from "./util";

export default function ExternalEmbed({ post, React }: UnitArgs["embed"]) {
	if (!isExternalEmbed(post.embed)) return null;
	return (
		<div>
			<a
				href={post.embed.external.uri}
				target="_blank"
				rel="noopener noreferrer"
				style={{ display: "block", paddingRight: 30 }}
			>
				{post.embed.external.thumb && (
					<img
						style={{ objectFit: "cover", aspectRatio: "1.91 / 1", width: "100%" }}
						src={post.embed.external.thumb}
					/>
				)}
				<div>{post.embed.external.title}</div>
				<div>{post.embed.external.description}</div>
			</a>
		</div>
	);
}
