import type { GetMethod, Result, ResultPromise } from "./types";

function isXRPCResponse(response: any): response is { success: boolean; headers: unknown; data: any } {
	return true;
}

/**
 * @param func throwable
 * @returns non-throwable
 */
function wrapFunction<Func extends (...args: any[]) => unknown>(
	func: Func,
): (...args: Parameters<Func>) => Promise<Result<Awaited<ReturnType<Func>>>> {
	return async (...args) => {
		try {
			const response = await func(...args);
			if (isXRPCResponse(response)) {
				if (response.success) {
					return { ok: true, data: response.data };
				} else {
					return { ok: false, error: JSON.stringify(response) };
				}
			}
			return { ok: true, data: response };
		} catch (error) {
			return { ok: false, error: String(error) };
		}
	};
}

/**
 * @param func throwable
 * @param cacheTimeSec キャッシュの有効期限を秒で指定
 */
export function createGet<Func extends (...args: any[]) => unknown>(func: Func, cacheTimeSec: number): GetMethod<Func> {
	const wrappedFunc = wrapFunction(func);
	const promiseMap = new Map<string, ResultPromise<Func>>();
	const cacheMap = new Map<string, { data: Awaited<ResultPromise<Func>>; time: number }>();
	const refreshCache = () => {
		if (requestIdleCallback != null) {
			requestIdleCallback(checkCacheInner);
		} else {
			setTimeout(checkCacheInner, 0);
		}
	};
	const checkCacheInner = () => {
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
	return async (useCache, ...args) => {
		const key = JSON.stringify(args);
		const cached = cacheMap.get(key);
		const cachedPromise = promiseMap.get(key);
		refreshCache();
		if (useCache && cached != null) {
			if (cached.time + cacheTimeSec * 1000 > Date.now()) return cached.data;
			cacheMap.delete(key);
		} else if (useCache && cachedPromise != null) {
			return await cachedPromise;
		}
		const promise = wrappedFunc(...args).finally(() => promiseMap.delete(key));
		promiseMap.set(key, promise);
		const data = await promise;
		if (data.ok) {
			cacheMap.set(key, { data, time: Date.now() });
		} else {
			cacheMap.delete(key);
		}
		return data;
	};
}
const get = createGet((a: string, b: number) => {
	return a + b;
}, 10);

// /**
//  * @param func non-throwable
//  */
// export function createPost<Params extends ParamsType, Result>(
// 	func: (params: Params) => Promise<Result>,
// ): PostMethod<Params, Result> {
// 	return {
// 		emit: (params) => {
// 			return func(params);
// 		},
// 	};
// }
