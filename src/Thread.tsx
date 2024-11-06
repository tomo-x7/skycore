import { useLocation, useParams } from "react-router-dom";
import type { AppBskyFeedDefs, Agent } from "@atproto/api";
import { useEffect, useRef, useState } from "react";
import type { params } from "./App";
import { PostView } from "./Post";

type data =
	| { type: "thread"; data: AppBskyFeedDefs.ThreadViewPost }
	| { type: "notFound"; data: AppBskyFeedDefs.NotFoundPost }
	| { type: "blocked"; data: AppBskyFeedDefs.BlockedPost }
	| { type: "post"; data: AppBskyFeedDefs.PostView }
	| { type: "error"; data: string }
	| undefined;
const isNotFound = (data: unknown): data is AppBskyFeedDefs.NotFoundPost => {
	if (typeof data === "object" && data !== null && (data as AppBskyFeedDefs.NotFoundPost).notFound === true) {
		return true;
	}
	return false;
};
const isBlocked = (data: unknown): data is AppBskyFeedDefs.BlockedPost => {
	if (typeof data === "object" && data !== null && (data as AppBskyFeedDefs.BlockedPost).blocked === true) {
		return true;
	}
	return false;
};
const isThread = (data: unknown): data is AppBskyFeedDefs.ThreadViewPost => {
	if (
		typeof data === "object" &&
		data !== null &&
		typeof (data as AppBskyFeedDefs.ThreadViewPost).post === "object" &&
		!isNotFound(data) &&
		!isBlocked(data)
	) {
		return true;
	}
	return false;
};
const getPost = async (
	agent: Agent,
	setdata: React.Dispatch<React.SetStateAction<data>>,
	user?: string,
	rkey?: string,
) => {
	if (!user || !rkey) {
		setdata({ type: "error", data: "bad uri" });
		return;
	}
	let did: string;
	if (/^did:/.test(user)) {
		did = user;
	} else {
		const res = await agent.resolveHandle({ handle: user });
		if (res.success) {
			did = res.data.did;
		} else {
			setdata({ type: "error", data: "cannot resolve handle" });
			return;
		}
	}
	const res = await agent.getPostThread({ uri: `at://${did}/app.bsky.feed.post/${rkey}` }).catch((e) => {
		setdata({ type: "error", data: `cannot get post:${e}`.replace("Error:", "") });
	});
	if (!res) return;
	if (isNotFound(res.data.thread)) {
		setdata({ type: "notFound", data: res.data.thread });
		return;
	}
	if (isBlocked(res.data.thread)) {
		setdata({ type: "blocked", data: res.data.thread });
		return;
	}
	if (isThread(res.data.thread)) {
		setdata({ type: "thread", data: res.data.thread });
		return;
	}
};

export function Thread({ params }: { params: params }) {
	const { agent } = params;
	const [data, setdata] = useState<data>();
	const { user, rkey } = useParams();
	const location = useLocation();
	const post: AppBskyFeedDefs.PostView | undefined = location.state;
	useEffect(() => {
		if (post) {
			setdata({ type: "post", data: post });
		}
		getPost(agent, setdata, user, rkey);
	}, [agent, user, rkey, post]);

	return <ThreadView data={data} PostViewUnit={PostView} />;
}

function ThreadView({ data, PostViewUnit }: { data: data; PostViewUnit: typeof PostView }) {
	const treeTopref = useRef<HTMLSpanElement>(null);
	const [bottomSpaceHeight, setbottomSpaceHeight] = useState(0);
	useEffect(() => {
		if (data?.type === "thread" && treeTopref.current) {
			setbottomSpaceHeight(window.innerHeight - treeTopref.current.clientHeight);
			setTimeout(() => treeTopref.current?.scrollIntoView(), 0);
		}
	}, [data]);
	if (!data) {
		return <>loading...</>;
	}
	if (data.type === "error") {
		return <>error:{data.data}</>;
	}
	if (data.type === "blocked" || data.type === "notFound") {
		return <PostViewUnit post={data.data} />;
	}
	if (data.type === "post") {
		const id = Math.floor(Math.random() * 1000000);
		return (
			<>
				<PostViewUnit key={data.data.uri} post={data.data} />
				<style>
					{`.loader${id} {
						--_m: 
							conic-gradient(#0000 10%,#000),
							linear-gradient(#000 0 0) content-box;
						-webkit-mask: var(--_m);
						mask: var(--_m);
						-webkit-mask-composite: source-out;
						mask-composite: subtract;
						animation: l3 1s infinite linear;
					}
					@keyframes l3 {to{transform: rotate(1turn)}}`}
				</style>
				<div
					style={{ width: "50px", padding: "8px", aspectRatio: 1, borderRadius: "50%", background: "#000" }}
					className={`loader${id}`}
				/>
			</>
		);
	}
	if (data.type === "thread") {
		const getParents = (
			post: AppBskyFeedDefs.ThreadViewPost,
		): (AppBskyFeedDefs.ThreadViewPost | AppBskyFeedDefs.NotFoundPost | AppBskyFeedDefs.BlockedPost)[] => {
			if (post.parent && isThread(post.parent)) {
				return [post.parent, ...getParents(post.parent)];
			}
			if (post.parent && (isBlocked(post.parent) || isNotFound(post.parent))) {
				return [post.parent];
			} else {
				return [];
			}
		};
		type repliestype = (
			| { post: AppBskyFeedDefs.ThreadViewPost; reply?: repliestype }
			| { post: AppBskyFeedDefs.BlockedPost | AppBskyFeedDefs.NotFoundPost; reply?: undefined }
		)[];
		const parents = getParents(data.data);

		const getReplies = (post: AppBskyFeedDefs.ThreadViewPost): repliestype => {
			if (!post.replies) {
				return [];
			}
			return post.replies
				.map((reply) => {
					if (isThread(reply)) {
						return { post: reply, reply: getReplies(reply) };
					}
					if (isBlocked(reply) || isNotFound(reply)) {
						return { post: reply };
					}
					return undefined;
				})
				.filter((v) => v != null);
		};
		const filterReply = (
			reply: repliestype[0],
			parentdid: string,
			thisdid: string,
		): (AppBskyFeedDefs.ThreadViewPost | AppBskyFeedDefs.NotFoundPost | AppBskyFeedDefs.BlockedPost)[] => {
			if (isThread(reply?.post)) {
				if (!reply.reply) {
					return [reply.post];
				}
				const parentsForFilter = parents
					.toReversed()
					.slice(0, 1)
					.filter(isThread)
					.map((post) => post.post.author.did);
				const selected = reply.reply
					.filter(
						(reply) =>
							isThread(reply.post) &&
							(reply.post.post.author.did === parentdid || reply.post.post.author.did === thisdid),
					)
					.toSorted(
						(a, b) =>
							new Date((a.post as AppBskyFeedDefs.ThreadViewPost).post.indexedAt).valueOf() -
							new Date((b.post as AppBskyFeedDefs.ThreadViewPost).post.indexedAt).valueOf(),
					)[0];
				return [reply.post, ...filterReply(selected, parentdid, thisdid).filter((v) => v != null)];
			} else {
				return [reply?.post];
			}
		};
		const replies = getReplies(data.data)
			.filter((reply) => isThread(reply.post))
			.map((reply) =>
				filterReply(
					reply,
					data.data.post.author.did,
					(reply.post as AppBskyFeedDefs.ThreadViewPost).post.author.did,
				),
			);
		console.log(replies);
		return (
			<>
				{parents.toReversed().map((post, i) => (
					<PostViewUnit
						key={`${((post.uri as string) ?? (post.post as { uri: string }).uri).slice(-10, -1)}${i}`}
						post={isThread(post) ? post.post : post}
						isTree
						hasReply
						hasParent={i !== 0}
					/>
				))}
				<span ref={treeTopref}>
					<PostViewUnit key={data.data.post.uri} post={data.data.post} />
				</span>
				{replies.map((replies) => (
					<div key={(replies[0].uri as string) ?? (replies[0].post as { uri: string }).uri}>
						<hr />
						{replies.map((reply, i) => (
							<PostViewUnit
								key={(reply.uri as string) ?? (reply.post as { uri: string }).uri}
								post={isThread(reply) ? reply.post : reply}
								isTree
								hasReply={i !== replies.length - 1}
								hasParent
							/>
						))}
					</div>
				))}
				{bottomSpaceHeight !== 0 && <div style={{ height: `${bottomSpaceHeight}px` }} />}
			</>
		);
	}
}
