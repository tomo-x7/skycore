import type { AppBskyActorDefs } from "@atproto/api";
import { type PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { logger } from "../../fetcher/logger";
type Profile = Omit<AppBskyActorDefs.ProfileViewDetailed, "did" | "handle"> & { handle?: string; did?: string };
const Context = createContext<Profile>({});

export function ProfileProvider({ children }: PropsWithChildren) {
	const [profile, setProfile] = useState<Profile>({});
	useEffect(() => {
		fetcher.getProfile(true, { actor: fetcher.did }).then((res) => {
			if (res.ok) setProfile(res.data);
			else logger.error(`Failed to fetch profile${res.error}`);
		});
	}, []);
	return <Context value={profile}>{children}</Context>;
}

export function useProfile() {
	return useContext(Context);
}
