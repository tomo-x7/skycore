import type { FC, PropsWithChildren, ReactNode } from "react";
import { type ToastPosition, Toaster } from "react-hot-toast";
import { ProfileProvider } from "./lib/contexts/profile";
import { useMediaQueries } from "./lib/hooks/device";
import { HomeFeedProvider } from "./lib/contexts/homefeed";

type Provider<T> = [FC<T & { children: ReactNode }>, T];
function createProviders<T extends object[]>(...providers: { [K in keyof T]: Provider<T[K]> }) {
	return providers;
}
function mapProvider<T>(child: ReactNode, [Provider, props]: Provider<T>) {
	return <Provider {...props}>{child}</Provider>;
}
function reduce<T extends object[]>(
	providersArr: { [K in keyof T]: Provider<T[K]> },
	reducer: (prev: ReactNode, cur: Provider<T[number]>) => ReactNode,
	init: ReactNode,
) {
	return providersArr.reduceRight(reducer, init);
}

export function Providers({ children }: PropsWithChildren<Record<string, unknown>>) {
	const { isMobile } = useMediaQueries();
	const toastPosition = (isMobile ? "bottom-center" : "bottom-left") satisfies ToastPosition;
	const providersArr = createProviders([ProfileProvider, {}], [HomeFeedProvider, {}]);
	return (
		<>
			{reduce(providersArr, mapProvider, children)}
			<Toaster position={toastPosition} />
		</>
	);
}
