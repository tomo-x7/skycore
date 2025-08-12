import type { AppBskyFeedPost } from "@atproto/api";
import type { UnitArgs } from "./type";
export default function TLPost({ post, isReply, hasReply, longReply,React}: UnitArgs["TLPost"]) {
	
	return (
		<div className="tlpost">
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

				{longReply && <div className="openthread">スレッドをすべて表示</div>}
			</div>
		</div>
	);
}
