import { Agent } from "@atproto/api";
import { CHANGE_USER_KEY, resumeSession } from "./auth";
import { getCurrentSession, getSavedSession, listSavedSessions, SessionData, setCurrentDid } from "./session";
import type { CacheGetMethod, NoCacheGetMethod } from "./types";
import { createCacheXRPCGetter, createNoCacheXRPCGetter } from "./util";

export interface Fetcher {
	getTimeline: NoCacheGetMethod<Agent["getTimeline"]>;
	getProfile: CacheGetMethod<Agent["getProfile"]>;
	getProfiles: CacheGetMethod<Agent["getProfiles"]>;
	sessionManager: SessionManager;
}
interface SessionManager {
	listSavedSessions: () => SessionData[] | null;
	changeUser: (did: string) => void;
	signOutAll: () => void;
}
const sessionManager: SessionManager = {
	listSavedSessions: () => {
		return listSavedSessions();
	},
	changeUser: (did) => {
		setCurrentDid(did);
		if (getSavedSession(did)?.isexpired === false) {
			location.reload();
		}
		location.href = "/login";
	},
	signOutAll: () => {
		location.href = "/login";
	},
};
export async function createFetcher() {
	const sessionData = getCurrentSession();
	if (sessionData == null) return null;
	const session = await resumeSession(sessionData);
	const agent = new Agent(session);
	// 読み込み時に実行されることを期待してここに書いておく
	// 誤作動防止処置
	sessionStorage.removeItem(CHANGE_USER_KEY);

	const fetcher: Fetcher = {
		sessionManager,
		getTimeline: createNoCacheXRPCGetter(agent.getTimeline),
		getProfile: createCacheXRPCGetter(agent.getProfile, 60 * 5),
		getProfiles: createCacheXRPCGetter(agent.getProfiles, 60 * 5),
	};
	return fetcher;
}
