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
				type="button"
				onClick={open}
				style={{
					position: "fixed",
					backgroundColor: "blue",
					border: 0,
					borderRadius: 999,
					width: 60,
					height: 60,
					bottom: isTablet ? 30 : 80,
					right: 30,
				}}
			>
				<FaRegPenToSquare color="white" size={20} />
			</button>
			{isOpen && <NewPost initText={initText} close={close} />}
		</>
	);
}
