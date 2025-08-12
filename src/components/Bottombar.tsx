import type { IconBaseProps } from "react-icons";
import { AiOutlineBell, AiOutlineHome, AiOutlineMessage, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useMatches } from "../lib/hooks/match";

const bottomBarIconStyle = (isCur: boolean) => ({ color: isCur ? "blue" : "black", size: 30 }) satisfies IconBaseProps;

export function BottomBar() {
	const { isHome, isSearch, isMessages, isNotifications, isSelfProfile } = useMatches();
	return (
		<div
			style={{
				alignItems: "center",
				borderTop: "1px solid #ccc",
				bottom: 0,
				display: "flex",
				height: 60,
				justifyContent: "space-around",
				left: 0,
				position: "fixed",
				right: 0,
			}}
		>
			<Link to={"/"}>
				<AiOutlineHome {...bottomBarIconStyle(isHome)} />
			</Link>
			<Link to={"/search"}>
				<AiOutlineSearch {...bottomBarIconStyle(isSearch)} />
			</Link>
			<Link to={"/messages"}>
				<AiOutlineMessage {...bottomBarIconStyle(isMessages)} />
			</Link>
			<Link to={"/notifications"}>
				<AiOutlineBell {...bottomBarIconStyle(isNotifications)} />
			</Link>
			<Link to={`/profile/${fetcher.did}`}>
				<AiOutlineUser {...bottomBarIconStyle(isSelfProfile)} />
			</Link>
		</div>
	);
}
