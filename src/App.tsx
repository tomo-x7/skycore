import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Search } from "./Search";
import { Sidebar } from "./Sidebar";
import { Notifications } from "./Notifications";
import { Settings } from "./Settings";
import { Profile } from "./Profile";
import { Thread } from "./Thread";
import { Navibar } from "./Navibar";
import type { Agent, BskyPreferences } from "@atproto/api";
import { NewPost, openNewPost } from "./Newpost";

export type params = { agent: Agent; openNewPost: typeof openNewPost; pref: BskyPreferences };
export type UnitDefaultParams = { agent: Agent; openNewPost: typeof openNewPost };
let params: params | undefined = undefined;
let defaultParams: UnitDefaultParams | undefined = undefined;
export function App({ agent, pref }: { agent: Agent; pref: BskyPreferences }) {
	params = { agent, openNewPost, pref };
	defaultParams = { agent, openNewPost };
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
					<Route path="profile/:user/post/:rkey" element={<Thread />} />
					<Route path="profile/:user" element={<Profile />} />
					<Route path="settings" element={<Settings />} />
					<Route path="*" element={<Home />} />
				</Routes>
			</div>
			<div style={{ flexShrink: 1, flexGrow: 1 }}>
				<Navibar />
			</div>
			<NewPost />
		</div>
	);
}

export function useDefaultParams() {
	if (!params) {
		throw new Error("params not defined");
	}
	return params;
}
export function useUnitDefaultParams() {
	if (!defaultParams) {
		throw new Error("UnitDefaultparams not defined");
	}
	return defaultParams;
}
