import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { LinkProps, Link as ReactLink } from "react-router-dom";

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
	return (
		<>
			<div style={{position:"relative"}}>
				<Link
					active={isTree}
					to={`/profile/${post.author.handle}/post/${post.uri.split("/")[4]}`}
					state={post}
					style={{
						textDecoration: "none",
						color: "inherit",
						userSelect: "auto",
						width: "100%",
						height: "100%",
						position: "absolute",display:"block",zIndex:0,cursor:"pointer"
					}} tabIndex={0}
				/>
				<div style={{ display: "flex" ,zIndex:1}}>
					{isTree && (
						<div style={{ width: "15px" }}>
							{hasParent ? <div style={lineStyle} /> : <div style={{ height: "50%" }} />}
							{hasReply && <div style={lineStyle} />}
						</div>
					)}
					<div>
						<div style={{ marginLeft: isTree ? "15px" : "" }}>{post.author.displayName}'s post</div>
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
			</div>
		</>
	);
}

function Link({ active = true, ...props }: { active?: boolean } & LinkProps & React.RefAttributes<HTMLAnchorElement>) {
	if (active) {
		return <ReactLink {...props} />;
	} else {
		return props.children;
	}
}
