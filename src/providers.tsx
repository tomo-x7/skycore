import type { FC, PropsWithChildren, ReactNode } from "react";
import { Toaster, type ToastPosition } from "react-hot-toast";
import { HomeFeedProvider } from "./lib/contexts/homefeed";
import { LoaderProvider } from "./lib/contexts/loader";
import { ProfileProvider } from "./lib/contexts/profile";
import { useMediaQueries } from "./lib/hooks/device";
import type { Loader } from "./loader/types";

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

export function Providers({ children, loader }: PropsWithChildren<{ loader: Loader }>) {
	const { isMobile } = useMediaQueries();
	const toastPosition = (isMobile ? "bottom-center" : "bottom-left") satisfies ToastPosition;
	const providersArr = createProviders([ProfileProvider, {}], [HomeFeedProvider, {}], [LoaderProvider, { loader }]);
	return (
		<>
			{reduce(providersArr, mapProvider, children)}
			<Toaster position={toastPosition} />
		</>
	);
}
