import { Link } from "react-router-dom";
import "./style.css";
import { IconType } from "react-icons";
import {
	AiOutlineHome,
	AiOutlineSearch,
	AiOutlineMessage,
	AiOutlineBell,
	AiOutlineUnorderedList,
	AiOutlineUser,
	AiOutlineSetting,
} from "react-icons/ai";
import { HiOutlineHashtag } from "react-icons/hi";
import { useMatches } from "../../lib/hooks/match";
import { useProfile } from "../../lib/contexts/profile";

function NavItem({ to, text, active, Icon }: { to: string; text: string; active: boolean; Icon: IconType }) {
	return (
		<li>
			<Link to={to} onClick={close} className={active ? "active" : ""}>
				<Icon size={25} className="icon" />
				{text}
			</Link>
		</li>
	);
}

export function LeftNav() {
	const { isHome, isFeeds, isLists, isMessages, isNotifications, isSearch, isSelfProfile, isSettings } = useMatches();
	const profile = useProfile();
	return (
		<div className="leftNav">
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
		</div>
	);
}
