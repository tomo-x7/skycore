import type { CredentialSession } from "@atproto/api";
import { Outlet, useLoaderData } from "react-router-dom";
import { useMediaQueries } from "../lib/hooks/device";
import { Providers } from "../providers";
import { BottomBar } from "./Bottombar";
import { Drawer } from "./Drawer";
import { LeftNav } from "./LeftNav";
import { RightNav } from "./RightNav";

export function MainLayout() {
	const { isMobile } = useMediaQueries();
	return <Providers>{isMobile ? <MobileLayout /> : <DesktopLayout />}</Providers>;
}
function DesktopLayout() {
	const { isDesktop } = useMediaQueries();
	return (
		<>
			<div style={{ display: "flex" }}>
				<LeftNav />
				<div style={{ width: 600 }}>
					<Outlet />
				</div>
				{isDesktop && <RightNav />}
			</div>
		</>
	);
}
function MobileLayout() {
	return (
		<>
			<Drawer />
			<Outlet />
			<BottomBar />
		</>
	);
}
