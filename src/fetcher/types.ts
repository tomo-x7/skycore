export type Result<Response> =
	| { ok: true; data: Response extends { success: boolean; headers: unknown; data: infer Data } ? Data : Response }
	| { ok: false; error: string };

export type ParamsType = Record<string | number, unknown> | undefined;
export type GetMethod<Function extends (...args: any[]) => unknown> = (
	useCache?: boolean,
	...params: Parameters<Function>
) => Promise<Result<Awaited<ReturnType<Function>>>>;
export type PostMethod<Params extends ParamsType, Response> = (params: Params) => Promise<Result<Awaited<Response>>>;
export type ResultPromise<Func extends (...args: any[]) => unknown> = ReturnType<GetMethod<Func>>;
