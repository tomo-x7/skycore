import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Search } from "./Search";
import { Sidebar } from "./Sidebar";
import { Notifications } from "./Notifications";
import { Settings } from "./Settings";
import { Profile } from "./Profile";
import { Post } from "./Post";
import { Navibar } from "./Navibar";
import type { Agent } from "@atproto/api";

export function App({agent}:{agent:Agent}) {
	return (
		<div style={{ display: "flex" }}>
			<div style={{ flexShrink: 1, flexGrow: 1 }}>
				<Sidebar />
			</div>
			<div style={{ flexBasis: "600px", flexShrink: 0, flexGrow: 0 }}>
				<Routes>
					<Route path="search" element={<Search />} />
					<Route path="notifications" element={<Notifications />} />
					<Route path="messages" element={<Home />} />
					<Route path="feeds" element={<Home />} />
					<Route path="lists" element={<Home />} />
					<Route path="profile/:user/post/:rkey" element={<Post agent={agent} />} />
					<Route path="profile/:user" element={<Profile />} />
					<Route path="settings" element={<Settings />} />
					<Route path="*" element={<Home />} />
				</Routes>
			</div>
			<div style={{ flexShrink: 1, flexGrow: 1 }}>
				<Navibar />
			</div>
		</div>
	);
}
