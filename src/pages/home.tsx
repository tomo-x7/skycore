import { MobileNewPostButton } from "../components/MobileNewPostButton";
import { Drawer } from "../components/Drawer/";
import { useMediaQueries } from "../lib/hooks/device";
import { Link } from "react-router-dom";
import { HiOutlineHashtag } from "react-icons/hi";
import "./home.css";
import { useEffect, useMemo, useState,use } from "react";
import { SavedFeed, SavedFeedsPref } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export function Home() {
	const { isMobile } = useMediaQueries();
	const pinnedFeeds = usePinnedFeeds();
	const [currentFeed, setCurrentFeed] = useState<SavedFeed|null>(null);
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
				<div className="switcher">
					{pinnedFeeds.map(feed=>(<div key={feed.id}>{feed.data.displayName}</div>))}
				</div>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
					<div key={v}>post {v}</div>
				))}
				<MobileNewPostButton />
			</div>
		</>
	);
}

function usePinnedFeeds() {
	const res= use(fetcher.getSavedFeeds(true))
	return res.ok ? res.data.filter((feed) => feed.pinned) : [];
	// const [pinnedFeeds, setPinnedFeeds] = useState<SavedFeed[]|null>([]);
	// useEffect(() => {
	// 	fetcher
	// 		.getSavedFeeds()
	// 		.then((feeds) => (feeds.ok ? feeds.data.filter((feed) => feed.pinned) : []))
	// 		.then((feeds) => setPinnedFeeds(feeds));
	// }, []);
	// return pinnedFeeds;
}

function getCurrentFeed(pinned: SavedFeed[]) {
	const saved = localStorage.getItem("HOMEFEED");
	if (saved) {
		const findSaved = pinned.find((feed) => feed.value === saved);
		if (findSaved) {
			return findSaved;
		}else{
			setCurrentFeed(pinned[0])
		}
	}
}

function setCurrentFeed(feed: SavedFeed) {
	if (feed) {
		localStorage.setItem("HOMEFEED", feed.value);
	} else {
		localStorage.removeItem("HOMEFEED");
	}
}