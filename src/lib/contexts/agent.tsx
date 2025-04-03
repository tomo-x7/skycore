import { Agent } from "@atproto/api";
import { type PropsWithChildren, createContext, useContext } from "react";
import { useSession } from "./session";

const context = createContext<Agent>(new Agent(""));
export function AgentProvider({ children }: PropsWithChildren) {
	const session = useSession();
	const agent = new Agent(session);
	return <context.Provider value={agent}>{children}</context.Provider>;
}

export function useAgent() {
	return useContext(context);
}
