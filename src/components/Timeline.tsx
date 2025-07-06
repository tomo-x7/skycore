import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutoSizer, InfiniteLoader, List } from "react-virtualized";
import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import "./Timeline.css";
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
					setList((old) => [...old, { $type: "error", error: res.error, cursor }]);
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
			{ rootMargin: "0px 0px 1000px 0px", root: timelineRef.current },
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
								key={postdata.cursor ?? "initload"}
								observer={observer}
								cursor={postdata.cursor}
							/>
						);
					case "error":
						return (
							<div key={postdata.cursor ?? postdata.error} className="error">
								{postdata.error}
								{postdata.cursor != null && (
									<button type="button" onClick={() => load(postdata.cursor)}>
										Retry
									</button>
								)}
							</div>
						);
					case "end":
						return (
							<div key={"end"} className="end">
								No more posts.
							</div>
						);
					default:
						return <TLPostThread key={postdata.post.uri} data={postdata} feed={feed} />;
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
		return () => {
			if (ref.current) observer?.unobserve(ref.current);
		};
	}, [observer]);
	return (
		<div ref={ref} data-cursor={cursor} style={{ color: "red" }}>
			loadmore {cursor ?? "init"}
		</div>
	);
}


