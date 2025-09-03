import type { $Typed, AppBskyEmbedImages, AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import type { UnitArgs, UnitConfig, UnitDefaultArgs } from "./type";
export default function TLPost({ post, isReply, hasReply, longReply, React, Embed }: UnitArgs["TLPost"]) {
	return (
		<div className="win-tomo-x-skycore-units-tlpost">
			<div className="left">
				<img alt="" className="avatar" height={32} src={post.author.avatar} width={32} />
				{hasReply && <div className="replybar" />}
				{longReply && (
					<>
						<div className="longreplybar" />
						<div className="longreplybar" />
						<div className="longreplybar" />
					</>
				)}
			</div>
			<div className="content">
				<div className="author">
					<div className="name">{post.author.displayName ?? post.author.handle}</div>
					<div className="handle">@{post.author.handle ?? post.author.did}</div>
				</div>
				<div className="text">{(post.record as AppBskyFeedPost.Record).text}</div>
				<Images post={post} React={React} />
				<Embed post={post} />

				{longReply && <div className="openthread">スレッドをすべて表示</div>}
			</div>
		</div>
	);
}

function Images({ post, React }: { post: AppBskyFeedDefs.PostView; React: UnitDefaultArgs["React"] }) {
	const embed = post.embed;
	if (!isImage(embed)) return null;
	return (
		<div className="images">
			<img alt={embed.images[0]?.alt} src={embed.images[0]?.thumb} />
			<img alt={embed.images[1]?.alt} src={embed.images[1]?.thumb} />
			<img alt={embed.images[2]?.alt} src={embed.images[2]?.thumb} />
			<img alt={embed.images[3]?.alt} src={embed.images[3]?.thumb} />
		</div>
	);
}

function isImage(embed: AppBskyFeedDefs.PostView["embed"]): embed is $Typed<AppBskyEmbedImages.View> {
	return embed?.$type === "app.bsky.embed.images#view";
}

export const config: UnitConfig = {
	css: ["./TLPost.css"],
};
