import type { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { useEffect, useState } from "react";
import { type LinkProps, useNavigate } from "react-router-dom";
import { type UnitDefaultParams, useUnitDefaultParams } from "./App";

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
const getPostRef = (post: { cid: string; uri: string }) => {
	const { uri, cid } = post;
	return { uri, cid };
};
export function PostView(params: {
	post: AppBskyFeedDefs.PostView | AppBskyFeedDefs.NotFoundPost | AppBskyFeedDefs.BlockedPost;
	isTree?: boolean;
	hasReply?: boolean;
	hasParent?: boolean;
	root?: { cid: string; uri: string };
}) {
	return <PostViewUnit {...params} {...useUnitDefaultParams()} />;
}

export function PostViewUnit({
	post,
	isTree = false,
	hasParent = false,
	hasReply = false,
	agent,
	openNewPost,
	root,
}: {
	post: AppBskyFeedDefs.PostView | AppBskyFeedDefs.NotFoundPost | AppBskyFeedDefs.BlockedPost;
	isTree?: boolean;
	hasParent?: boolean;
	hasReply?: boolean;
	root?: { cid: string; uri: string };
} & UnitDefaultParams) {
	const [isopenRP, setOpenRP] = useState(false);
	const [postRP, setpostRP] = useState<string | undefined>(
		typeof post.viewer === "object" && post.viewer != null
			? (post.viewer as { repost?: string })?.repost
			: undefined,
	);
	if (isBlocked(post)) {
		return <>blocked</>;
	}
	if (isNotFound(post)) {
		return <>notfound</>;
	}
	useEffect(() => {
		const listener = () => {
			setOpenRP(false);
		};
		document.addEventListener("click", listener);
		return () => document.removeEventListener("click", listener);
	}, []);
	const lineStyle: React.CSSProperties = { borderRight: "3px black solid", width: "15px", height: "50%" };
	const author =
		post.author.displayName === "" || post.author.displayName == null
			? post.author.handle
			: post.author.displayName;
	const reply = () => {
		if (isBlocked(post) || isNotFound(post)) return;
		if (root) {
			openNewPost({ reply: { parent: getPostRef(post), root: getPostRef(root) } });
		} else {
			openNewPost({ reply: { parent: getPostRef(post), root: getPostRef(post) } });
		}
	};
	const openRP = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		document.dispatchEvent(new PointerEvent("click"));
		ev.stopPropagation();
		setOpenRP(true);
	};
	const RP = async () => {
		if (postRP) {
			if (postRP !== "temp") {
				agent.deleteRepost(postRP);
				setpostRP(undefined);
			} else {
				window.alert("wait a little");
			}
		} else {
			setpostRP("temp");
			const { uri } = await agent.repost(post.uri, post.cid);
			setpostRP(uri);
		}
	};
	const quote = () => {
		openNewPost({ quote: { record: getPostRef(post) } });
	};
	return (
		<>
			<div style={{ position: "relative" }}>
				<Link
					disactive={!isTree}
					to={`/profile/${post.author.handle}/post/${post.uri.split("/")[4]}`}
					state={post}
				>
					<div style={{ display: "flex" }}>
						{isTree && (
							<div style={{ width: "15px" }}>
								{hasParent ? <div style={lineStyle} /> : <div style={{ height: "50%" }} />}
								{hasReply && <div style={lineStyle} />}
							</div>
						)}
						<div>
							<div style={{ marginLeft: isTree ? "15px" : "" }}>{author}'s post</div>
							<div style={{ marginLeft: isTree ? "15px" : "", whiteSpace: "pre-wrap" }}>
								{(post.record as AppBskyFeedPost.Record).text}
							</div>
							<div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
								<button type="button" onMouseUp={(ev) => ev.stopPropagation()} onClick={reply}>
									💭
								</button>
								<span onMouseUp={(ev) => ev.stopPropagation()} style={{ position: "relative" }}>
									<button type="button" onClick={openRP}>
										{postRP ? "🔁" : "↻"}
									</button>
									{isopenRP && (
										<div
											style={{
												position: "absolute",
												width: "150px",
												display: "flex",
												flexDirection: "column",
												zIndex: 10,
											}}
										>
											<button
												type="button"
												onClick={RP}
												style={{ width: "100%", textAlign: "left" }}
											>
												{postRP ? "リポストを取り消す" : "リポスト"}
											</button>
											<button type="button" onClick={quote}>
												引用
											</button>
										</div>
									)}
								</span>
								<span>❤</span>
								<span>...</span>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</>
	);
}

function Link({ disactive = false, ...props }: { disactive?: boolean } & LinkProps) {
	if (disactive) {
		return props.children;
	}

	const [mousexy, setmousexy] = useState<[number, number]>([0, 0]);
	const navigation = useNavigate();
	const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (ev) => {
		setmousexy([ev.screenX, ev.screenY]);
	};
	const onMouseUp: React.MouseEventHandler<HTMLDivElement> = (ev) => {
		const [x1, y1] = mousexy;
		const { screenX: x2, screenY: y2 } = ev;
		// console.log((x1 - x2) ** 2 + (y1 - y2) ** 2 )
		if ((x1 - x2) ** 2 + (y1 - y2) ** 2 < 100) {
			navigation(props.to, { state: props.state });
		}
	};
	return (
		<div
			style={{ ...props.style, cursor: "pointer" }}
			className="link"
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
		>
			{props.children}
		</div>
	);
}
