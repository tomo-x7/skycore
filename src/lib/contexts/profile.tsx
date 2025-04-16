import type { AppBskyActorDefs } from "@atproto/api";
import { type PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { useAgent } from "./agent";
type Profile = Omit<AppBskyActorDefs.ProfileViewDetailed, "did" | "handle">;
const Context = createContext<Profile>({});
export function ProfileProvider({ children }: PropsWithChildren) {
	const [profile, setProfile] = useState<Profile>({});
	const agent = useAgent();
	useEffect(() => {
		const ac = new AbortController();
		agent
			.getProfile({ actor: agent.assertDid }, { signal: ac.signal })
			.then((res) => {
				setProfile(res.data);
			})
			.catch((e) => {
				if (!ac.signal.aborted) console.error(e); //abort時以外のエラーはログ
			});
		return () => ac.abort("effect cleanup");
	}, [agent]);
	return <Context.Provider value={profile}>{children}</Context.Provider>;
}

export function useProfile() {
	return useContext(Context);
}
