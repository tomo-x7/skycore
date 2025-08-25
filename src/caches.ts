import { type DidCache, MemoryCache } from "@atproto/identity";

const didCache = new MemoryCache();
export function getDidCache(): DidCache {
	return didCache;
}
