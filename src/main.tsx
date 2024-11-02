import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Loader } from "./Loader.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Config } from "./Config.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/config" element={<Config />} />
				<Route path="*" element={<Loader />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
