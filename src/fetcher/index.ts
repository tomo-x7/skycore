import { Agent } from "@atproto/api";
import type { SavedFeed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import type { GeneratorView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { DidResolver } from "@atproto/identity";
import { getDidCache } from "../caches";
import { CHANGE_USER_KEY, resumeSession } from "./auth";
import { getCurrentSession, getSavedSession, listSavedSessions, type SessionData, setCurrentDid } from "./session";
import type { CacheGetMethod, NoCacheGetMethod, ResolvedDid } from "./types";
import { createCacheGetter, createCacheXRPCGetter, createNoCacheXRPCGetter, createResolveDid } from "./util";

export interface Fetcher {
	getTimeline: NoCacheGetMethod<Agent["getTimeline"]>;
	getFeed: NoCacheGetMethod<Agent["app"]["bsky"]["feed"]["getFeed"]>;
	getProfile: CacheGetMethod<Agent["getProfile"]>;
	getProfiles: CacheGetMethod<Agent["getProfiles"]>;
	getSavedFeeds: CacheGetMethod<() => Promise<(SavedFeed & { data: GeneratorView })[]>>;
	resolveDid: (did: string) => Promise<ResolvedDid>;
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
	changeUser: (did) => {
		setCurrentDid(did);
		if (getSavedSession(did)?.isexpired === false) {
			location.reload();
		}
		location.href = "/login";
	},
	listSavedSessions: () => {
		return listSavedSessions();
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
	const didResolver = new DidResolver({ didCache: getDidCache(), timeout: 10 * 1000 });
	// 読み込み時に実行されることを期待してここに書いておく
	// 誤作動防止処置
	sessionStorage.removeItem(CHANGE_USER_KEY);

	const fetcher: Fetcher = {
		did: agent.assertDid,
		getFeed: createNoCacheXRPCGetter((...p) => agent.app.bsky.feed.getFeed(...p)),
		getProfile: createCacheXRPCGetter(agent.getProfile, 60 * 5),
		getProfiles: createCacheXRPCGetter(agent.getProfiles, 60 * 5),
		getSavedFeeds: createCacheGetter(
			async () => {
				const pref = await agent.getPreferences();
				if (pref.savedFeeds.length === 0) return [];
				const { data: feedData } = await agent.app.bsky.feed.getFeedGenerators({
					feeds: pref.savedFeeds
						.filter((feed) => feed.type === "feed" || feed.type === "list")
						.map((feed) => feed.value),
				});

				return pref.savedFeeds
					.filter((feed) => feed.type === "feed" || feed.type === "list" || feed.type === "timeline")
					.map((feed) => ({
						...feed,
						data:
							feed.type === "timeline"
								? { displayName: "following" }
								: feedData.feeds.find((f) => f.uri === feed.value),
					})).filter((feed)=>feed.data!=null);
			},
			60 * 60 * 24,
		),
		getTimeline: createNoCacheXRPCGetter(agent.getTimeline),
		resolveDid: createResolveDid(didResolver),
		rawAgent: agent,
		sessionManager,
	};
	return fetcher;
}
