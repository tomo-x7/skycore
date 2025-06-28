import { Agent } from "@atproto/api";
import { CHANGE_USER_KEY, resumeSession } from "./auth";
import { type SessionData, getCurrentSession, getSavedSession, listSavedSessions, setCurrentDid } from "./session";
import type { CacheGetMethod, NoCacheGetMethod } from "./types";
import { createCacheGetter, createCacheXRPCGetter, createNoCacheXRPCGetter } from "./util";
import { SavedFeed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { GeneratorView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export interface Fetcher {
	getTimeline: NoCacheGetMethod<Agent["getTimeline"]>;
	getProfile: CacheGetMethod<Agent["getProfile"]>;
	getProfiles: CacheGetMethod<Agent["getProfiles"]>;
	getSavedFeeds: CacheGetMethod<() => Promise<(SavedFeed & { data: GeneratorView })[]>>;
	sessionManager: SessionManager;
	rawAgent: Agent;
	did: string;
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
	if (session == null) return null;
	const agent = new Agent(session);
	// 読み込み時に実行されることを期待してここに書いておく
	// 誤作動防止処置
	sessionStorage.removeItem(CHANGE_USER_KEY);

	const fetcher: Fetcher = {
		sessionManager,
		rawAgent: agent,
		did: agent.assertDid,
		getTimeline: createNoCacheXRPCGetter(agent.getTimeline),
		getProfile: createCacheXRPCGetter(agent.getProfile, 60 * 5),
		getProfiles: createCacheXRPCGetter(agent.getProfiles, 60 * 5),
		getSavedFeeds: createCacheGetter(
			async () => {
				const pref = await agent.getPreferences();
				if (pref.savedFeeds.length === 0) return [];
				const { data: feedData } = await agent.app.bsky.feed.getFeedGenerators({
					feeds: pref.savedFeeds.filter((feed) => feed.type !== "timeline").map((feed) => feed.value),
				});

				return pref.savedFeeds.map((feed) => ({
					...feed,
					data:
						feed.type === "timeline"
							? { displayName: "following" }
							: feedData.feeds.find((f) => f.uri === feed.value),
				}));
			},
			60 * 60 * 24,
		),
	};
	return fetcher;
}
