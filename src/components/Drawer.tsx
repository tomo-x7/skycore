import { useState } from "react";
import DrawerLib from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

export function useDrawer(): [React.ReactNode, () => void] {
	const [isopen, setIsOpen] = useState(false);
	return [<Drawer isopen={isopen} close={() => setIsOpen(false)} key="drawer" />, () => setIsOpen(true)];
}

function Drawer({ isopen, close }: { isopen: boolean; close: () => void }) {
	return (
		<>
			<DrawerLib open={isopen} direction="left" onClose={close}>
				hello
			</DrawerLib>
		</>
	);
}
