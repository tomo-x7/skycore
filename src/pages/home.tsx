import { HiOutlineHashtag } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Drawer } from "../components/Drawer/";
import { MobileNewPostButton } from "../components/MobileNewPostButton";
import { useMediaQueries } from "../lib/hooks/device";
import "./home.css";
import { Suspense, use, useEffect, useRef } from "react";
import { Timeline } from "../components/Timeline";
import { useHomeFeed } from "../lib/contexts/homefeed";

export function Home() {
	const { isMobile } = useMediaQueries();

	return (
		<div className="home">
			<div className="header">
				<div>{isMobile && <Drawer />}</div>
				<img alt="logo" className="logo" src="/logo.png" />
				<Link to="/feeds">
					<HiOutlineHashtag className="feeds-logo" color="#666" size={30} />
				</Link>
			</div>
			<Suspense fallback={<div>HomeFeed Loading...</div>}>
				<HomeInner />
			</Suspense>
		</div>
	);
}
function HomeInner() {
	const pinnedFeeds = usePinnedFeeds();
	const { home, setHome } = useHomeFeed();
	useEffect(() => {
		if (pinnedFeeds.length > 0 && home == null) {
			setHome(pinnedFeeds[0].value);
		}
	}, [pinnedFeeds, home, setHome]);
	const switcherRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const onWheel = (e: WheelEvent) => {
			if (switcherRef.current != null) {
				switcherRef.current.scrollLeft += e.deltaY;
				e.preventDefault();
			}
		};
		switcherRef.current?.addEventListener("wheel", onWheel, { passive: false });
		return () => switcherRef.current?.removeEventListener("wheel", onWheel);
	}, []);
	return (
		<>
			<div className="switcher" ref={switcherRef}>
				{pinnedFeeds.map((feed) => (
					<button
						className={home === feed.value ? "active" : ""}
						key={feed.id}
						onClick={home === feed.value ? () => goTop() : () => setHome(feed.value)}
						type="button"
					>
						{feed.data.displayName}
					</button>
				))}
			</div>
			<div className="tl">{home && <Timeline feed={home} key={home} />}</div>
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
