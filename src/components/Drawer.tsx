import { useState } from "react";
import DrawerLib from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useProfile } from "../lib/contexts/profile";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Drawer.css";
import { Link } from "react-router-dom";
import { useMatches } from "../lib/hooks/match";
import { IconType } from "react-icons";
import {
	AiOutlineBell,
	AiOutlineHome,
	AiOutlineMessage,
	AiOutlineOrderedList,
	AiOutlineProfile,
	AiOutlineSearch,
	AiOutlineSetting,
	AiOutlineUnorderedList,
	AiOutlineUser,
} from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import { HiOutlineHashtag } from "react-icons/hi";

function createNavItem({ close }: { close: () => void }) {
	return ({ to, text, active, Icon }: { to: string; text: string; active: boolean; Icon: IconType }) => (
		<li>
			<Link to={to} onClick={close} className={active ? "active" : ""}>
				<Icon size={25} className="icon" />
				{text}
			</Link>
		</li>
	);
}

export function Drawer() {
	const [isopen, setIsOpen] = useState(false);
	const profile = useProfile();
	const NavItem = createNavItem({ close: () => setIsOpen(false) });
	const { isHome, isFeeds, isLists, isMessages, isNotifications, isSearch, isSelfProfile, isSettings } = useMatches();
	return (
		<>
			<span className="drawer-button">
				<button type="button" onClick={() => setIsOpen(true)}>
					<GiHamburgerMenu size={30} />
				</button>
			</span>
			<DrawerLib open={isopen} direction="left" onClose={() => setIsOpen(false)} size={300}>
				<span className="drawer">
					<div className="profile">
						<img src={profile.avatar} />
						<div className="display-name">{profile.displayName || profile.handle}</div>
						<div className="handle">@{profile.handle}</div>
						<div>
							<span className="count">{profile.followersCount}</span>フォロワー・
							<span className="count">{profile.followsCount}</span>フォロー
						</div>
					</div>
					<div className="navlist">
						<ul>
							<NavItem to="/" text="ホーム" active={isHome} Icon={AiOutlineHome} />
							<NavItem to="/search" text="検索" active={isSearch} Icon={AiOutlineSearch} />
							<NavItem to="/messages" text="チャット" active={isMessages} Icon={AiOutlineMessage} />
							<NavItem to="/notifications" text="通知" active={isNotifications} Icon={AiOutlineBell} />
							<NavItem to="/feeds" text="フィード" active={isFeeds} Icon={HiOutlineHashtag} />
							<NavItem to="/lists" text="リスト" active={isLists} Icon={AiOutlineUnorderedList} />
							<NavItem
								to={`/profile/${profile.did}`}
								text="プロフィール"
								active={isSelfProfile}
								Icon={AiOutlineUser}
							/>
							<NavItem to="/settings" text="設定" active={isSettings} Icon={AiOutlineSetting} />
						</ul>
					</div>
				</span>
			</DrawerLib>
		</>
	);
}
