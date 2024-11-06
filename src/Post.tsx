import type { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { useState } from "react";
import { type LinkProps, useNavigate } from "react-router-dom";

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

export function PostView({
	post,
	isTree = false,
	hasParent = false,
	hasReply = false,
}: {
	post: AppBskyFeedDefs.PostView | AppBskyFeedDefs.NotFoundPost | AppBskyFeedDefs.BlockedPost;
	isTree?: boolean;
	hasParent?: boolean;
	hasReply?: boolean;
}) {
	if (isBlocked(post)) {
		return <>blocked</>;
	}
	if (isNotFound(post)) {
		return <>notfound</>;
	}
	const lineStyle: React.CSSProperties = { borderRight: "3px black solid", width: "15px", height: "50%" };
	const author =
		post.author.displayName === "" || post.author.displayName == null
			? post.author.handle
			: post.author.displayName;
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
								<span>💭</span>
								<span>🔁</span>
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
