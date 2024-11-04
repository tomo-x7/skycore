import { useLocation, useParams } from "react-router-dom";
import type { AtpAgent, AppBskyFeedDefs, Agent } from "@atproto/api";
import { useEffect, useState } from "react";

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
		typeof (data as AppBskyFeedDefs.ThreadViewPost).post === "object"
	) {
		return true;
	}
	return false;
};
const getPost = async (
	agent: Agent,
	setpostview: React.Dispatch<React.SetStateAction<data>>,
	user?: string,
	rkey?: string,
) => {
	if (!user || !rkey) {
		setpostview({ type: "error", data: "bad uri" });
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
			setpostview({ type: "error", data: "cannot resolve handle" });
			return;
		}
	}
	const res = await agent.getPostThread({ uri: `at://${did}/app.bsky.feed.post/${rkey}` }).catch((e) => {
		setpostview({ type: "error", data: `cannot get post:${e}`.replace("Error:", "") });
	});
	if (!res) return;
	if (isNotFound(res.data.thread)) {
		setpostview({ type: "notFound", data: res.data.thread });
		return;
	}
	if (isBlocked(res.data.thread)) {
		setpostview({ type: "blocked", data: res.data.thread });
		return;
	}
	if (isThread(res.data.thread)) {
		setpostview({ type: "thread", data: res.data.thread });
		return;
	}
};
export function Post({ agent }: { agent: Agent }) {
	const [postview, setpostview] = useState<data>();
	const { user, rkey } = useParams();
	const location = useLocation();
	const post: AppBskyFeedDefs.PostView | undefined = location.state;
	if (post) {
		setpostview({ type: "post", data: post });
	} else {
		useEffect(() => void getPost(agent, setpostview, user, rkey), [agent, user, rkey]);
	}

	return <PostView data={postview} />;
}

function PostView({ data }: { data: data }) {
	if (!data) {
		return <>loading...</>;
	}
	if (data.type === "error") {
		return <>error:{data.data}</>;
	}
	if (data.type === "blocked") {
		return <>blocked</>;
	}
	if (data.type === "notFound") {
		return <>notfound</>;
	}
	if (data.type === "post") {
		return <>loading...</>;
	}
	if (data.type === "thread") {
		return (
			<>
				{data.data.post.author.displayName}'s {data.data.post.uri}post
			</>
		);
	}
}
