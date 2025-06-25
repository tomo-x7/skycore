import type { IconBaseProps } from "react-icons";
import { AiOutlineBell, AiOutlineHome, AiOutlineMessage, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useMatches } from "../lib/hooks/match";

const bottomBarIconStyle = (isCur: boolean) => ({ size: 30, color: isCur ? "blue" : "black" }) satisfies IconBaseProps;

export function BottomBar() {
	const { isHome, isSearch, isMessages, isNotifications, isSelfProfile } = useMatches();
	return (
		<>
			<div
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					height: 60,
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					borderTop: "1px solid #ccc",
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
		</>
	);
}
