import { getHandle, getPdsEndpoint, isValidDidDoc } from "@atproto/common-web";
import type { DidResolver } from "@atproto/identity";
import type { XRPCResponse } from "@atproto/xrpc";
import type { CacheGetMethod, NoCacheGetMethod, ResolvedDid, Result, ResultPromise } from "./types";

/**
 * @param func throwable
 * @returns non-throwable
 */
export function wrapFunction<Func extends (...args: any[]) => any>(
	func: Func,
): (...args: Parameters<Func>) => Promise<Result<Awaited<ReturnType<Func>>>> {
	return async (...args) => {
		try {
			const response = await func(...args);
			return { data: response, ok: true };
		} catch (error) {
			return { error: String(error), ok: false };
		}
	};
}
/**
 * @param func throwable xrpc
 * @returns non-throwable
 */
export function wrapXRPCFunction<Func extends (...args: any[]) => Promise<XRPCResponse> | XRPCResponse>(
	func: Func,
): (...args: Parameters<Func>) => Promise<Result<Awaited<ReturnType<Func>>>> {
	return async (...args) => {
		try {
			const response = await func(...args);
			if (response.success) {
				return { data: response.data, ok: true };
			} else {
				return { error: JSON.stringify(response), ok: false };
			}
		} catch (error) {
			return { error: String(error), ok: false };
		}
	};
}

/**
 * @param func throwable
 * @param cacheTimeSec キャッシュの有効期限を秒で指定
 */
export function createCacheGetter<Func extends (...args: any[]) => any>(
	func: Func,
	cacheTimeSec: number,
	errorCacheTimeSec?: number,
): CacheGetMethod<Func> {
	const wrappedFunc = wrapFunction(func);
	return createCacheGetterInner(wrappedFunc, cacheTimeSec, errorCacheTimeSec);
}
/**
 * @param func throwable xrpc
 * @param cacheTimeSec キャッシュの有効期限を秒で指定
 */
export function createCacheXRPCGetter<Func extends (...args: any[]) => Promise<XRPCResponse> | XRPCResponse>(
	func: Func,
	cacheTimeSec: number,
	errorCacheTimeSec?: number,
): CacheGetMethod<Func> {
	const wrappedFunc = wrapXRPCFunction(func);
	return createCacheGetterInner(wrappedFunc, cacheTimeSec, errorCacheTimeSec);
}

function createCacheGetterInner<Func extends (...args: any[]) => any>(
	wrappedFunc: (...args: Parameters<Func>) => Promise<Result<Awaited<ReturnType<Func>>>>,
	cacheTimeSec: number,
	errorCacheTimeSec = 10,
): CacheGetMethod<Func> {
	const cacheMap = new Map<string, { promise: ResultPromise<Func>; time: number }>();
	const refreshCache = () => {
		if (requestIdleCallback != null) {
			requestIdleCallback(refreshCacheInner);
		} else {
			setTimeout(refreshCacheInner, 0);
		}
	};
	const refreshCacheInner = () => {
		const expiredKeys: string[] = [];
		let i = 0;
		for (const [key, value] of cacheMap.entries()) {
			if (value.time + cacheTimeSec * 1000 < Date.now()) {
				i++;
				expiredKeys.push(key);
				if (i > 30) break;
			}
		}
		for (const key of expiredKeys) {
			cacheMap.delete(key);
		}
	};
	return (useCache, ...args) => {
		const key = JSON.stringify(args);
		const cached = cacheMap.get(key);
		refreshCache();
		if (useCache && cached != null) {
			if (cached.time + cacheTimeSec * 1000 > Date.now()) return cached.promise;
			cacheMap.delete(key);
		}
		const promise = wrappedFunc(...args);
		cacheMap.set(key, { promise, time: Date.now() });
		promise.then((data) => {
			if (!data.ok) {
				if (errorCacheTimeSec == null) {
					cacheMap.delete(key);
				} else {
					setTimeout(() => {
						cacheMap.delete(key);
					}, errorCacheTimeSec * 1000);
				}
			}
		});
		return promise;
	};
}

/**
 * @param func throwable
 * 瞬間的な二重fetchのみ防ぐ
 */
export function createNoCacheGetter<Func extends (...args: any[]) => any>(func: Func): NoCacheGetMethod<Func> {
	const wrappedFunc = wrapFunction(func);
	return createNoCacheGetterInner(wrappedFunc);
}
/**
 * @param func throwable xrpc
 * 瞬間的な二重fetchのみ防ぐ
 */
export function createNoCacheXRPCGetter<Func extends (...args: any[]) => Promise<XRPCResponse> | XRPCResponse>(
	func: Func,
): NoCacheGetMethod<Func> {
	const wrappedFunc = wrapXRPCFunction(func);
	return createNoCacheGetterInner(wrappedFunc);
}
function createNoCacheGetterInner<Func extends (...args: any[]) => any>(
	wrappedFunc: (...args: Parameters<Func>) => Promise<Result<Awaited<ReturnType<Func>>>>,
): NoCacheGetMethod<Func> {
	let lastKey: string | null = null;
	let lastPromise: ResultPromise<Func> | null = null;
	return (...args) => {
		const key = JSON.stringify(args);
		if (key === lastKey && lastPromise != null) {
			return lastPromise;
		}
		const promise = wrappedFunc(...args);
		lastKey = key;
		lastPromise = promise;
		setTimeout(() => {
			lastKey = null;
			lastPromise = null;
		}, 300);
		return promise;
	};
}

export function createResolveDid(didResolver: DidResolver): (did: string) => Promise<ResolvedDid> {
	return async (did: string) => {
		const doc = await didResolver.resolve(did);
		if (!isValidDidDoc(doc)) throw new Error("Invalid DID document");
		const handle = getHandle(doc);
		if (handle == null) throw new Error("Invalid DID document:handle");
		const pdsEndpoint = getPdsEndpoint(doc);
		if (pdsEndpoint == null) throw new Error("Invalid DID document:pdsEndpoint");
		return {
			handle,
			pdsEndpoint,
		};
	};
}
