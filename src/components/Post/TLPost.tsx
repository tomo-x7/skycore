import type { AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import type { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { FaRotate } from "react-icons/fa6";
import "./TLPost.css";
import { useLoader } from "../../lib/contexts/loader";
import { generateDefaultUnitArgs } from "../../loader/util";
import { EmbedWrapper } from "../Embed";

export function TLPostThread({ data, feed }: { data: AppBskyFeedDefs.FeedViewPost; feed: string }) {
	const { reason, reply } = data;
	const isReply = reason?.$type !== "app.bsky.feed.defs#reasonRepost" && reply != null;
	const loader = useLoader();
	if (isReply && feed === "following" && shouldShowFollowingReply(reply, data.post.author) === false) return null;
	const TLPost = loader.units.TLPost;
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
			<TLPost isReply={isReply} post={data.post} {...generateDefaultUnitArgs()} Embed={EmbedWrapper} />
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
	const loader = useLoader();
	const TLPost = loader.units.TLPost;
	if (data.root.$type !== "app.bsky.feed.defs#postView" || data.parent.$type !== "app.bsky.feed.defs#postView")
		return null;
	const root = data.root as AppBskyFeedDefs.PostView;
	const parent = data.parent as AppBskyFeedDefs.PostView;
	if (root.uri === parent.uri) {
		return <TLPost hasReply post={parent} {...generateDefaultUnitArgs()} Embed={EmbedWrapper} />;
	}
	const isLong = (parent.record as AppBskyFeedPost.Record).reply?.parent.uri !== root.uri;
	return (
		<>
			<TLPost hasReply longReply={isLong} post={root} {...generateDefaultUnitArgs()} Embed={EmbedWrapper} />
			<TLPost hasReply isReply post={parent} {...generateDefaultUnitArgs()} Embed={EmbedWrapper} />
		</>
	);
}
