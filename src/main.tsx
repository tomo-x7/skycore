import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createFetcher } from "./fetcher/index.ts";
import { createLoader } from "./loader/index.ts";
import { About } from "./otherpages/about.tsx";
import { Login } from "./otherpages/login.tsx";
import { SplashScreen } from "./pages/splash.tsx";
import { UnitConfig } from "./pages/unitConfig.tsx";
import { logSubscriptions, performanceLog } from "./util.ts";

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
	const { log, setListener } = logSubscriptions();
	root.render(<SplashScreen setListener={setListener} />);

	log("fetcher loading");
	const fetcherEnd = performanceLog();
	const fetcher = await createFetcher();
	log(`fetcher loaded in ${fetcherEnd().toFixed(2)} ms`);
	if (fetcher == null) {
		location.href = "/login";
		return;
	}
	log("loader loading");
	const loaderEnd = performanceLog();
	const loader = createLoader();
	await loader.loadUnits(log);
	log(`loader loaded in ${loaderEnd().toFixed(2)} ms`);
	globalThis.fetcher = fetcher;
	globalThis.goTop = () => void 0;
	root.render(
		<StrictMode>
			<App loader={loader} />
		</StrictMode>,
	);
}

init();
