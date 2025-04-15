import type { CredentialSession } from "@atproto/api";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { type ToastPosition, Toaster } from "react-hot-toast";
import { AgentProvider } from "./lib/contexts/agent";
import { ProfileProvider } from "./lib/contexts/profile";
import { SessionProvider } from "./lib/contexts/session";
import { useMediaQueries } from "./lib/hooks/device";

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

export function Providers({ children, session }: PropsWithChildren<{ session: CredentialSession }>) {
	const { isMobile } = useMediaQueries();
	const toastPosition = (isMobile ? "bottom-center" : "bottom-left") satisfies ToastPosition;
	const providersArr = createProviders([SessionProvider, { session }], [AgentProvider, {}], [ProfileProvider, {}]);
	return (
		<>
			{reduce(providersArr, mapProvider, children)}
			<Toaster position={toastPosition} />
		</>
	);
}
