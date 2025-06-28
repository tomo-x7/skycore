import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createFetcher } from "./fetcher/index.ts";
import { About } from "./otherpages/about.tsx";
import { Login } from "./otherpages/login.tsx";

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
	}

	const fetcher = await createFetcher();
	if (fetcher == null) {
		location.href = "/login";
		return;
	}
	globalThis.fetcher = fetcher;
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<Suspense fallback={<>loading...</>}><App /></Suspense>
		</StrictMode>,
	);
}

init();
