import { AppBskyActorProfile, AppBskyActorDefs } from "@atproto/api";
import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { useAgent } from "./agent";
type Profile = Omit<AppBskyActorDefs.ProfileViewDetailed, "did" | "handle">;
const Context = createContext<Profile>({});
export function ProfileProvider({ children }: PropsWithChildren) {
	const [profile, setProfile] = useState<Profile>({});
	const agent = useAgent();
	useEffect(() => {
		const ac = new AbortController();
		agent.getProfile({ actor: agent.assertDid }, { signal: ac.signal }).then((res) => {
			setProfile(res.data);
		});
		return () => ac.abort();
	}, [agent]);
	return <Context.Provider value={profile}>{children}</Context.Provider>;
}

export function useProfile() {
	return useContext(Context);
}
