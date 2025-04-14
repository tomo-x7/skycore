import type { CredentialSession } from "@atproto/api";
import {
	Outlet,
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
	redirect,
	useLoaderData,
} from "react-router-dom";
import { resumeSession } from "./lib/auth";
import { getCurrentSession } from "./lib/session";
import { About } from "./pages/about";
import { Login } from "./pages/login";
import { Providers } from "./providers";
import toast from "react-hot-toast";
import { useMediaQueries } from "./lib/hooks/device";
import { BottomBar } from "./components/Bottombar";
import { RightNav } from "./components/RightNav";
import { LeftNav } from "./components/LeftNav";
import { useDrawer } from "./components/Drawer";
import { MainLayout } from "./components/Layout";
import { Home } from "./pages/home";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{/* 認証不要のパス */}
			<Route path="about" element={<About />} />
			<Route path="login" element={<Login />} />
			{/* 認証がいるパス */}
			<Route
				loader={async () => {
					try {
						const session = getCurrentSession();
						if (session == null) return redirect("/login");
						const data = await resumeSession(session);
						toast.success(`signin as ${data.did}`);
						return data;
					} catch (e) {
						console.error(e);
						return redirect("/login");
					}
				}}
				HydrateFallback={() => <>loading...</>}
				element={<MainLayout />}
			>
				<Route index element={<Home />} />
				<Route path=":user" element={<>user</>} />
				<Route />
			</Route>
			{/* フォールバック */}
			<Route path="*" element={<>not found</>} />
		</>,
	),
);

export function App() {
	return <RouterProvider router={router} />;
}
