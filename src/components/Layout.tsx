import { Outlet } from "react-router-dom";
import { useMediaQueries } from "../lib/hooks/device";
import { Providers } from "../providers";
import { BottomBar } from "./Bottombar";
import { LeftNav } from "./DesktopNav/LeftNav";
import { RightNav } from "./DesktopNav/RightNav";

export function MainLayout() {
	const { isMobile } = useMediaQueries();
	return <Providers>{isMobile ? <MobileLayout /> : <DesktopLayout />}</Providers>;
}
function DesktopLayout() {
	const { isDesktop } = useMediaQueries();
	return (
		<>
			<div style={{height:"100dvh",width:"100dvw",display:"flex",justifyContent:"center"}}>
				<div style={{ display: "flex" }}>
					<LeftNav />
					<div style={{ width: 600 }}>
						<Outlet />
					</div>
					{isDesktop && <RightNav />}
				</div>
			</div>
		</>
	);
}
function MobileLayout() {
	return (
		<>
			<Outlet />
			<BottomBar />
		</>
	);
}
