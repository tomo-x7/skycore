import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createFetcher } from "./fetcher/index.ts";
import { loader } from "./loader/index.ts";
import { About } from "./otherpages/about.tsx";
import { Login } from "./otherpages/login.tsx";
import { UnitConfig } from "./pages/unitConfig.tsx";

async function init() {
	if (location.pathname.startsWith("/login")) {
		createRoot(document.getElementById("root")!).render(
			<StrictMode>
				<Login />
			</StrictMode>,
		);
		return;
	}
	if (location.pathname.startsWith("/about")) {
		createRoot(document.getElementById("root")!).render(
			<StrictMode>
				<About />
			</StrictMode>,
		);
		return;
	}
	if (location.pathname.startsWith("/unitConfig")) {
		loader.loadUnitUris();
		createRoot(document.getElementById("root")!).render(
			<StrictMode>
				<Suspense fallback={<>loading...</>}>
					<UnitConfig loader={loader} />
				</Suspense>
			</StrictMode>,
		);
		return;
	}
	// splash作ったらそこに移行
	await loader.loadUnits((message) => console.log(message));
	const fetcher = await createFetcher();
	if (fetcher == null) {
		location.href = "/login";
		return;
	}
	globalThis.fetcher = fetcher;
	globalThis.goTop = () => void 0;
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<Suspense fallback={<>loading...</>}>
				<App loader={loader} />
			</Suspense>
		</StrictMode>,
	);
}

init();
