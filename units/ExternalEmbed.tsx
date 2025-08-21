import { BiWorld } from "react-icons/bi";
import type { UnitArgs, UnitConfig } from "./type";
import { isExternalEmbed } from "./util";

export default function ExternalEmbed({ post, React }: UnitArgs["embed"]) {
	if (!isExternalEmbed(post.embed)) return null;
	return (
		<div className="win-tomo-x-skycore-units-external-embed">
			<a href={post.embed.external.uri} target="_blank" rel="noopener noreferrer">
				{post.embed.external.thumb && <img src={post.embed.external.thumb} />}
				<div className="content">
					<div className="title">{post.embed.external.title}</div>
					<div className="description">{post.embed.external.description}</div>
					<hr />
					<div className="hostname"><BiWorld color="#888" size={16} />{new URL(post.embed.external.uri).hostname}</div>
				</div>
			</a>
		</div>
	);
}

export const config: UnitConfig = {
	css: ["ExternalEmbed.css"],
};
