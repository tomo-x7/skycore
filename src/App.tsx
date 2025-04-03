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

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{/* 認証不要のパス */}
			<Route path="about" element={<About />} />
			<Route path="login" element={<Login />} />
			{/* 認証がいるパス */}
			<Route
				loader={() => {
					try {
						const session = getCurrentSession();
						if (session == null) return void (location.href = "/login");
						return resumeSession(session);
					} catch (e) {
						console.error(e);
						return void (location.href = "/login");
					}
				}}
				HydrateFallback={() => <>loading...</>}
				element={<MainLayout />}
			>
				<Route index element={<>home</>} />
			</Route>
			{/* フォールバック */}
			<Route path="*" element={<>not found</>} />
		</>,
	),
);

export function App() {
	return <RouterProvider router={router} />;
}

function MainLayout() {
	const session: CredentialSession = useLoaderData();
	toast.success(`signin as ${session.did}`)
	return (
		<Providers session={session}>
			<Outlet />
		</Providers>
	);
}
