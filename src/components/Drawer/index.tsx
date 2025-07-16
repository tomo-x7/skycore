import { useState } from "react";
import type { IconType } from "react-icons";
import {
	AiOutlineBell,
	AiOutlineHome,
	AiOutlineMessage,
	AiOutlineSearch,
	AiOutlineSetting,
	AiOutlineUnorderedList,
	AiOutlineUser,
} from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineHashtag } from "react-icons/hi";
import DrawerLib from "react-modern-drawer";
import { Link } from "react-router-dom";
import { useProfile } from "../../lib/contexts/profile";
import { useMatches } from "../../lib/hooks/match";
import "react-modern-drawer/dist/index.css";
import "./style.css";

function createNavItem({ close }: { close: () => void }) {
	return ({ to, text, active, Icon }: { to: string; text: string; active: boolean; Icon: IconType }) => (
		<li>
			<Link className={active ? "active" : ""} onClick={close} to={to}>
				<Icon className="icon" size={25} />
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
				<button onClick={() => setIsOpen(true)} type="button">
					<GiHamburgerMenu size={30} />
				</button>
			</span>
			<DrawerLib direction="left" onClose={() => setIsOpen(false)} open={isopen} size={300}>
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
							<NavItem active={isHome} Icon={AiOutlineHome} text="ホーム" to="/" />
							<NavItem active={isSearch} Icon={AiOutlineSearch} text="検索" to="/search" />
							<NavItem active={isMessages} Icon={AiOutlineMessage} text="チャット" to="/messages" />
							<NavItem active={isNotifications} Icon={AiOutlineBell} text="通知" to="/notifications" />
							<NavItem active={isFeeds} Icon={HiOutlineHashtag} text="フィード" to="/feeds" />
							<NavItem active={isLists} Icon={AiOutlineUnorderedList} text="リスト" to="/lists" />
							<NavItem
								active={isSelfProfile}
								Icon={AiOutlineUser}
								text="プロフィール"
								to={`/profile/${profile.did}`}
							/>
							<NavItem active={isSettings} Icon={AiOutlineSetting} text="設定" to="/settings" />
						</ul>
					</div>
				</span>
			</DrawerLib>
		</>
	);
}
