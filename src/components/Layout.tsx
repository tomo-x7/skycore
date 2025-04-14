import { CredentialSession } from "@atproto/api";
import { useLoaderData, Outlet } from "react-router-dom";
import { useMediaQueries } from "../lib/hooks/device";
import { Providers } from "../providers";
import { BottomBar } from "./Bottombar";
import { useDrawer } from "./Drawer";
import { LeftNav } from "./LeftNav";
import { RightNav } from "./RightNav";

export function MainLayout() {
	const session: CredentialSession = useLoaderData();
	const { isMobile } = useMediaQueries();
	return <Providers session={session}>{isMobile ? <MobileLayout /> : <DesktopLayout />}</Providers>;
}
function DesktopLayout() {
	const { isDesktop } = useMediaQueries();
	return (
		<>
			<div className="flex">
				<LeftNav />
				<div className="w-[600px]">
					<Outlet />
				</div>
				{isDesktop && <RightNav />}
			</div>
		</>
	);
}
function MobileLayout() {
	const [Drawer, open] = useDrawer();
	return (
		<>
			<button type="button" onClick={open}>
				open
			</button>
			{Drawer}
			<Outlet />
			<BottomBar />
		</>
	);
}
