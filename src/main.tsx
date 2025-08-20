import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createFetcher } from "./fetcher/index.ts";
import { createLoader } from "./loader/index.ts";
import { About } from "./otherpages/about.tsx";
import { Login } from "./otherpages/login.tsx";
import { UnitConfig } from "./pages/unitConfig.tsx";

async function init() {
	const root = createRoot(document.getElementById("root")!);
	if (location.pathname.startsWith("/login")) {
		root.render(
			<StrictMode>
				<Login />
			</StrictMode>,
		);
		return;
	}
	if (location.pathname.startsWith("/about")) {
		root.render(
			<StrictMode>
				<About />
			</StrictMode>,
		);
		return;
	}
	if (location.pathname.startsWith("/unitConfig")) {
		const loader = createLoader();
		root.render(
			<StrictMode>
				<Suspense fallback={<>loading...</>}>
					<UnitConfig loader={loader} />
				</Suspense>
			</StrictMode>,
		);
		return;
	}
	// splash作ったらそこに移行
	const loader = createLoader();
	await loader.loadUnits((message) => console.log(message));
	const fetcher = await createFetcher();
	if (fetcher == null) {
		location.href = "/login";
		return;
	}
	globalThis.fetcher = fetcher;
	globalThis.goTop = () => void 0;
	root.render(
		<StrictMode>
			<App loader={loader} />
		</StrictMode>,
	);
}

init();
