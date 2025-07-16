import type { AppBskyFeedDefs } from "@atproto/api";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Timeline.css";
import type { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { TLPostThread } from "./Post/TLPost";

type PostData =
	| AppBskyFeedDefs.FeedViewPost
	| { $type: "loadmore"; cursor: string | undefined }
	| { $type: "error"; error: string; cursor: string | undefined }
	| { $type: "end" };

export function Timeline({ feed }: { feed: string | "following" }) {
	const [list, setList] = useState<PostData[]>([{ $type: "loadmore", cursor: undefined }]);
	const [observer, setObserver] = useState<IntersectionObserver | null>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const load = useCallback(
		(cursor: string | undefined) => {
			(feed === "following" ? fetcher.getTimeline({ cursor }) : fetcher.getFeed({ cursor, feed })).then((res) => {
				if (!res.ok) {
					setList((old) => [...old, { $type: "error", cursor, error: res.error }]);
					return;
				}
				// if (res.data.feed.length === 0) {
				// 	setList((old) => [...old, { $type: "end" }]);
				// 	return;
				// }
				setList((old) => [
					...old,
					...res.data.feed,
					res.data.cursor == null ? { $type: "end" } : { $type: "loadmore", cursor: res.data.cursor },
				]);
			});
		},
		[feed],
	);
	useEffect(() => {
		const curGoTop = () => {
			setList([]);
			load(undefined);
		};
		globalThis.goTop = curGoTop;
		return () => {
			if (goTop === curGoTop) goTop = () => void 0;
		};
	}, [load]);
	useEffect(() => {
		const obs = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const cursor = entry.target.getAttribute("data-cursor");
						load(cursor ?? undefined);
						obs.unobserve(entry.target);
					}
				});
			},
			{ root: timelineRef.current, rootMargin: "0px 0px 1000px 0px" },
		);
		setObserver(obs);
		return () => {
			obs.disconnect();
			setObserver(null);
		};
	}, [load]);
	return (
		<div className="timeline" ref={timelineRef}>
			{list.map((postdata) => {
				switch (postdata.$type) {
					case "loadmore":
						return (
							<MoreLoader
								cursor={postdata.cursor}
								key={postdata.cursor ?? "initload"}
								observer={observer}
							/>
						);
					case "error":
						return (
							<div className="error" key={postdata.cursor ?? postdata.error}>
								{postdata.error}
								{postdata.cursor != null && (
									<button onClick={() => load(postdata.cursor)} type="button">
										Retry
									</button>
								)}
							</div>
						);
					case "end":
						return (
							<div className="end" key={"end"}>
								No more posts.
							</div>
						);
					default:
						return (
							<TLPostThread
								data={postdata}
								feed={feed}
								key={postdata.post.uri + (postdata.reason as ReasonRepost)?.by.did}
							/>
						);
				}
			})}
		</div>
	);
}
function MoreLoader({ cursor, observer }: { observer: IntersectionObserver | null; cursor: string | undefined }) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current == null) return;
		observer?.observe(ref.current);
		console.log("observe");
		return () => {
			if (ref.current) observer?.unobserve(ref.current);
		};
	}, [observer]);
	return (
		<div data-cursor={cursor} ref={ref} style={{ color: "red" }}>
			loadmore {cursor ?? "init"}
		</div>
	);
}
