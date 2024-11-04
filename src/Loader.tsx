import { CredentialSession, AtpAgent, Agent } from "@atproto/api";
import { App } from "./App";
import { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";
import { useEffect, useState } from "react";

const client = new BrowserOAuthClient({
	handleResolver: "https://bsky.social",
	// Only works if the current origin is a loopback address:
	clientMetadata: undefined,
});
const init = async (setagent: React.Dispatch<React.SetStateAction<Agent | undefined>>) => {
	const result = await client.init();
	if (result) {
		setagent(new Agent(result.session));
	}
};
export function Loader() {
	const [agent, setagent] = useState<Agent>();
	useEffect(() => {
		init(setagent);
	}, []);
	if (!agent) {
		return <>loading session...</>;
	}
	return (
		<>
			<App agent={agent} />
		</>
	);
}
