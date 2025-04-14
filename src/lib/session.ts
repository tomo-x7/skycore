import type { AtpSessionData } from "@atproto/api";
import { jwtDecode } from "jwt-decode";

const CURRENT_DID_KEY = "current";
const SESSIONS_KEY = "sessions";
export type savedSessionData = {
	main: AtpSessionData;
	avatar: string | undefined;
	serviceUrl: string;
};
export type SessionData = {
	isexpired: boolean;
} & savedSessionData;

export function getCurrentSession(): SessionData | null {
	const did = getCurrentDid();
	if (did == null) return null;
	return getSavedSession(did)
}

export function getSavedSession(did:string):SessionData|null{
	const list = listSavedSessions();
	if (list == null) return null;
	return list.find((v) => v.main.did === did && !v.isexpired) ?? null;
}

export function listSavedSessions(): SessionData[] | null {
	const raw = localStorage.getItem(SESSIONS_KEY);
	const data = JSON.parse(raw ?? "[]") as savedSessionData[];
	if (!Array.isArray(data)) return null;
	return data.map((v) => ({ ...v, isexpired: isSessionExpired(v.main) }));
}

export function saveSession(data: savedSessionData) {
	const saved: savedSessionData[] =
		listSavedSessions()
			// 重複防止
			?.filter((v) => v.main.did !== data.main.did)
			// isexpired削除
			.map(({ main, avatar, serviceUrl }) => ({ main, avatar, serviceUrl })) ?? [];
	saved.push(data);
	localStorage.setItem(SESSIONS_KEY, JSON.stringify(saved));
}

export function getCurrentDid() {
	return localStorage.getItem(CURRENT_DID_KEY);
}

export function setCurrentDid(did: string) {
	localStorage.setItem(CURRENT_DID_KEY, did);
}

export function isSessionExpired(session: AtpSessionData) {
	try {
		if (session.accessJwt) {
			const decoded = jwtDecode(session.refreshJwt);
			if (decoded.exp) {
				const didExpire = Date.now() >= decoded.exp * 1000;
				return didExpire;
			}
		}
	} catch (e) {
		console.error("Could not decode JWT");
	}
	return true;
}
