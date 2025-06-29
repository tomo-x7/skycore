import { createContext, useContext, useState } from "react";

const Context = createContext<{ home: Readonly<string | null>; setHome: (aturi: string) => void }>({
	home: null,
	setHome: () => {},
});

export function HomeFeedProvider({ children }: { children: React.ReactNode }) {
	const [home, setHomeInner] = useState<string | null>(() => {
		const saved = localStorage.getItem("HOMEFEED");
		return saved ? saved : null;
	});
	const setHome = (aturi: string) => {
		localStorage.setItem("HOMEFEED", aturi);
		setHomeInner(aturi);
	};

	return <Context value={{ home, setHome }}>{children}</Context>;
}

export function useHomeFeed() {
	const context = useContext(Context);
	return context;
}
