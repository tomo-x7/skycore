import { useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useMediaQueries } from "../lib/hooks/device";
import { NewPost } from "./NewPost";

export function MobileNewPostButton({ initText }: { initText?: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const { isDesktop, isTablet } = useMediaQueries();
	const open = () => {
		setIsOpen(true);
	};
	const close = () => {
		setIsOpen(false);
	};

	if (isDesktop) return null;

	return (
		<>
			<button
				onClick={open}
				style={{
					backgroundColor: "blue",
					border: 0,
					borderRadius: 999,
					bottom: isTablet ? 30 : 80,
					height: 60,
					position: "fixed",
					right: 30,
					width: 60,
				}}
				type="button"
			>
				<FaRegPenToSquare color="white" size={20} />
			</button>
			{isOpen && <NewPost close={close} initText={initText} />}
		</>
	);
}
