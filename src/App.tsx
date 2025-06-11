import toast from "react-hot-toast";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect } from "react-router-dom";
import { MainLayout } from "./components/Layout";
import { resumeSession } from "./fetcher/auth";
import { getCurrentSession } from "./fetcher/session";
import { Home } from "./pages/home";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="/search" element={<>search</>} />
				<Route path="/messages" element={<>messages</>} />
				<Route path="/notifications" element={<>notifications</>} />
				<Route path="/feeds" element={<>feeds</>} />
				<Route path="/lists" element={<>lists</>} />
				<Route path="/profile/:user" element={<>user</>} />
			</Route>
			{/* フォールバック */}
			<Route path="*" element={<>not found</>} />
		</>,
	),
);

export function App() {
	return <RouterProvider router={router} />;
}
