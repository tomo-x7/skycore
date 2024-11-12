import { Agent, BskyPreferences } from "@atproto/api";
import { App } from "./App";
import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { useEffect, useRef, useState } from "react";

const client = await BrowserOAuthClient.load({
	handleResolver: "https://bsky.social",
	// Only works if the current origin is a loopback address:
	clientId: `http://localhost?redirect_uri=${encodeURIComponent("http://127.0.0.1:5173/callback")}&scope=${encodeURIComponent("atproto transition:generic transition:chat.bsky")}`,
});
const init = async (): Promise<{ agent: Agent; pref: BskyPreferences } | { agent: "login" }> => {
	const result = await client.init();
	if (result) {
		console.log("session loaded");
		const agent = new Agent(result.session);
		const pref = await agent.getPreferences();
		return { pref, agent };
	} else {
		return { agent: "login" };
	}
};
export function Loader() {
	const [agent, setagent] = useState<Agent | "login">();
	const pref = useRef<BskyPreferences>();
	useEffect(() => {
		init().then((d) => {
			if (d.agent === "login") {
				setagent(d.agent);
			} else {
				setagent(d.agent);
				pref.current = d.pref;
			}
		});
	}, []);
	if (!agent) {
		return <>loading session...</>;
	}
	if (agent === "login" || pref.current == null) {
		return (
			<>
				<Login />
			</>
		);
	}
	return (
		<>
			<App agent={agent} pref={pref.current} />
		</>
	);
}

function Login() {
	const inputref = useRef<HTMLInputElement>(null);
	const login = async () => {
		const identifier = inputref.current?.value;
		if (!identifier) {
			window.alert("invalid identifier");
			return;
		}
		await client.signIn(identifier, {
			state: crypto.getRandomValues(new Uint16Array(1)).join(""),
			ui_locales: "ja-JP en", // Only supported by some OAuth servers (requires OpenID Connect support + i18n support)
		});
	};
	return (
		<>
			<input type="text" ref={inputref} />
			<button type="button" onClick={login}>
				login
			</button>
		</>
	);
}
