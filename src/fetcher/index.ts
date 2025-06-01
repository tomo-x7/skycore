import { Agent } from "@atproto/api";
import { resumeSession } from "./auth";
import { getCurrentSession } from "./session";
import type { GetMethod } from "./types";

interface Fetcher {
	getTimeline: GetMethod<Agent["getTimeline"]>;
}
export async function createFetcher() {
	const sessionData = getCurrentSession();
	if (sessionData == null) return null;
	const session = await resumeSession(sessionData);
	const agent = new Agent(session);

	const fetcher: Fetcher = {
		getTimeline: async (useCache, params, opts) => {
			try {
				const res = await agent.getTimeline(params, opts);
				if (res.success) {
					return { ok: true, data: res.data };
				} else {
					return { ok: false, error: JSON.stringify(res) };
				}
			} catch (error) {
				return { ok: false, error: String(error) };
			}
		},
	};
}
