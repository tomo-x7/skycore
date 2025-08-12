import { createContext, useContext } from "react";
import type { Loader } from "../../loader/types";

const Context = createContext<Loader | null>(null);

export function LoaderProvider({ loader, children }: { loader: Loader; children: React.ReactNode }) {
	return <Context.Provider value={loader}>{children}</Context.Provider>;
}

export function useLoader() {
	const loader = useContext(Context);
	if (loader == null) throw new Error("Loader context not found");
	return loader;
}
