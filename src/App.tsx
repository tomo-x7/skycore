import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { MainLayout } from "./components/Layout";
import type { Loader } from "./loader/types";
import { Home } from "./pages/home";
import { Providers } from "./providers";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<MainLayout />}>
				<Route element={<Home />} index />
				<Route element={<>search</>} path="/search" />
				<Route element={<>messages</>} path="/messages" />
				<Route element={<>notifications</>} path="/notifications" />
				<Route element={<>feeds</>} path="/feeds" />
				<Route element={<>lists</>} path="/lists" />
				<Route element={<>user</>} path="/profile/:user" />
			</Route>
			{/* フォールバック */}
			<Route element={<>not found</>} path="*" />
		</>,
	),
);

export function App({ loader }: { loader: Loader }) {
	return (
		<Providers loader={loader}>
			<RouterProvider router={router} />
		</Providers>
	);
}
