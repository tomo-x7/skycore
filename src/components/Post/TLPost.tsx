import type { AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import type { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { FaRotate } from "react-icons/fa6";
import "./TLPost.css";


export function TLPostThread({ data, feed }: { data: AppBskyFeedDefs.FeedViewPost; feed: string }) {
	const { reason, reply } = data;
	const isReply = reason?.$type !== "app.bsky.feed.defs#reasonRepost" && reply != null;
	if (isReply && feed === "following" && shouldShowFollowingReply(reply, data.post.author) === false) return null;
	return (
		<div className="tlthread">
			{reason?.$type === "app.bsky.feed.defs#reasonRepost" && (
				<div className="reason">
					<FaRotate />
					{(reason as ReasonRepost).by.displayName ?? (reason as ReasonRepost).by.handle}がリポスト
				</div>
			)}
			{data.feedContext}
			{isReply && <ReplyTree data={reply} />}
			<TLPost isReply={isReply} post={data.post} />
		</div>
	);
}

function shouldShowFollowingReply(data: AppBskyFeedDefs.ReplyRef, author: AppBskyActorDefs.ProfileViewBasic) {
	if (data.parent.$type !== "app.bsky.feed.defs#postView" || data.root.$type !== "app.bsky.feed.defs#postView")
		return false;
	const root = data.root as AppBskyFeedDefs.PostView;
	const parent = data.parent as AppBskyFeedDefs.PostView;
	if (
		root.author.did === author.did &&
		(data.grandparentAuthor == null || data.grandparentAuthor?.did === author.did) &&
		parent.author.did === author.did
	)
		return true;
	if (parent.author.viewer?.following != null && parent.author.did !== author.did) return true;
	// if (root.author.viewer?.following != null&&root.author.did!==author.did) return true;
	return false;
}

function ReplyTree({ data }: { data: AppBskyFeedDefs.ReplyRef }) {
	if (data.root.$type !== "app.bsky.feed.defs#postView" || data.parent.$type !== "app.bsky.feed.defs#postView")
		return null;
	const root = data.root as AppBskyFeedDefs.PostView;
	const parent = data.parent as AppBskyFeedDefs.PostView;
	if (root.uri === parent.uri) {
		return <TLPost hasReply post={parent} />;
	}
	const isLong = (parent.record as AppBskyFeedPost.Record).reply?.parent.uri !== root.uri;
	return (
		<>
			<TLPost hasReply longReply={isLong} post={root} />
			<TLPost hasReply isReply post={parent} />
		</>
	);
}

function TLPost({
	post,
	isReply,
	hasReply,
	longReply,
}: {
	post: AppBskyFeedDefs.PostView;
	isReply?: boolean;
	hasReply?: boolean;
	longReply?: boolean;
}) {
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
