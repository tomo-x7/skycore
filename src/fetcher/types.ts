import type { XRPCResponse } from "@atproto/xrpc";

export type Result<Response> =
	| { ok: true; data: Response extends XRPCResponse ? Response["data"] : Response }
	| { ok: false; error: string };

export type ParamsType = Record<string | number, unknown> | undefined;
type Function = (...args: any[]) => any;
export type ResultPromise<F extends Function> = Promise<Result<Awaited<ReturnType<F>>>>;

export type NoCacheGetMethod<F extends Function> = (...params: Parameters<F>) => ResultPromise<F>;
export type CacheGetMethod<F extends Function> = (useCache: boolean, ...params: Parameters<F>) => ResultPromise<F>;
export type PostMethod<F extends Function> = (...params: Parameters<F>) => ResultPromise<F>;
