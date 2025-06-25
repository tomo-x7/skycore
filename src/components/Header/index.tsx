import { Link } from "react-router-dom";
import { useMediaQueries } from "../../lib/hooks/device";
import { useMatches } from "../../lib/hooks/match";
import { Drawer } from "../Drawer";
import { HiOutlineHashtag } from "react-icons/hi";
import "./style.css";

export function Header() {
	const { isHome, isFeeds, isLists, isMessages, isNotifications, isSearch, isSettings } = useMatches();
	return (
		<div className="header">
			{isHome && <HomeHeader />}
			{isSearch && <SearchHeader />}
			{isMessages && <MessagesHeader />}
			{isNotifications && <NotificationsHeader />}
			{isFeeds && <FeedsHeader />}
			{isLists && <ListsHeader />}
			{isSettings && <SettingsHeader />}
		</div>
	);
}
function HomeHeader() {
	const { isMobile } = useMediaQueries();
	return (
		<div className="home">
			<div>{isMobile && <Drawer />}</div>
			<img src="/logo.png" alt="logo" className="logo" />
			<Link to="/feeds">
				<HiOutlineHashtag className="feeds-logo" size={30} color="#666" />
			</Link>
		</div>
	);
}
function SearchHeader() {
	return <h1>検索</h1>;
}
function MessagesHeader() {
	return <h1>チャット</h1>;
}
function NotificationsHeader() {
	return <h1>通知</h1>;
}
function FeedsHeader() {
	return <h1>フィード</h1>;
}
function ListsHeader() {
	return <h1>リスト</h1>;
}
function SettingsHeader() {
	return <h1>設定</h1>;
}
