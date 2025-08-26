import { useEffect, useRef, useState } from "react";

export function SplashScreen({ setListener }: { setListener: (listener: (messages: string[]) => void) => void }) {
	const [messages, setMessages] = useState(["start loading"]);
	const scrollRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		setListener((messages) => setMessages(messages));
	}, [setListener]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: aa
	useEffect(() => {
		const scrollDiv = scrollRef.current;
		if (scrollDiv) {
			scrollDiv.scrollTop = scrollDiv.scrollHeight;
		}
	}, [messages]);
	return (
		<div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
			<div
				ref={scrollRef}
				style={{
					border: "1px solid black",
					padding: 12,
					width: 500,
					maxWidth: "100%",
					height: 150,
					overflowY: "scroll",
				}}
			>
				{...messages.map((m, i) => <div key={m + i}>{m}</div>)}
			</div>
		</div>
	);
}
