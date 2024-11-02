import type reactns from "react";

export type importunit<T> = Promise<{ default: T }>;

export type unit1 = ({
	React,
}: {
	React: typeof reactns;
}) => JSX.Element;
