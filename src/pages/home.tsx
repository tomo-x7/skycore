import { MobileNewPostButton } from "../components/MobileNewPostButton";
import { Drawer } from "../components/Drawer/";
import { useMediaQueries } from "../lib/hooks/device";
import { Link } from "react-router-dom";
import { HiOutlineHashtag } from "react-icons/hi";
import "./home.css";
import { useEffect, useMemo, useState, use, Suspense } from "react";
import { SavedFeed, SavedFeedsPref } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useHomeFeed } from "../lib/contexts/homefeed";

export function Home() {
	const { isMobile } = useMediaQueries();

	return (
		<>
			<div className="home">
				<div className="header">
					<div>{isMobile && <Drawer />}</div>
					<img src="/logo.png" alt="logo" className="logo" />
					<Link to="/feeds">
						<HiOutlineHashtag className="feeds-logo" size={30} color="#666" />
					</Link>
				</div>
				<Suspense fallback={<div>HomeFeed Loading...</div>}>
					<HomeInner />
				</Suspense>
			</div>
		</>
	);
}
function HomeInner() {
	const pinnedFeeds = usePinnedFeeds();
	const { home, setHome } = useHomeFeed();
	useEffect(() => {
		if (pinnedFeeds.length > 0 && home == null) {
			console.log(pinnedFeeds[0]);
			setHome(pinnedFeeds[0].value);
		}
	}, [pinnedFeeds, home, setHome]);
	console.log(home);
	return (
		<>
			<div className="switcher">
				{pinnedFeeds.map((feed) => (
					<button
						type="button"
						key={feed.id}
						className={home === feed.value ? "active" : ""}
						onClick={() => setHome(feed.value)}
					>
						{feed.data.displayName}
					</button>
				))}
			</div>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
				<div key={v}>post {v}</div>
			))}
			<MobileNewPostButton />
		</>
	);
}

function usePinnedFeeds() {
	const res = use(fetcher.getSavedFeeds(true));
	return res.ok
		? res.data.filter((feed) => feed.pinned)
		: (() => {
				throw new Error(res.error);
			})();
}
