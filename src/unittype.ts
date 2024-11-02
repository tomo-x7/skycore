import type reactns from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type importunit<T extends unit<any> | Record<string, unknown>> = T extends unit<any>
	? Promise<{ default: T }>
	: T extends Record<string, unknown>
		? Promise<{ default: unit<T> }>
		: never;
export type unit<T extends Record<string, unknown> | undefined = undefined> = T extends undefined
	? (React: typeof reactns) => JSX.Element
	: (React: typeof reactns, params: T) => JSX.Element;

export type unit1 = unit;
