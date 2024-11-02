import { Link } from "react-router-dom";

const links: { text: string; src: string }[] = [
	{ text: "icon", src: "/profile/example.bsky.social" },
	{ text: "ホーム", src: "/" },
	{ text: "検索", src: "/search" },
	{ text: "通知", src: "/notifications" },
	{ text: "チャット", src: "/messages" },
	{ text: "フィード", src: "/feeds" },
	{ text: "リスト", src: "/lists" },
	{ text: "プロフィール", src: "/profile/example.bsky.social" },
	{ text: "設定", src: "/settings" },
];

export function Sidebar() {
	return (
		<div>
			{links.map((linkd, i) => (
				<div key={`${i + linkd.src}`}>
					<Link style={{textDecoration:"none"}} to={linkd.src}>{linkd.text}</Link>
				</div>
			))}
		</div>
	);
}
