import { useEffect, useState } from "react";
import { CHANGE_USER_KEY, signIn } from "../fetcher/auth";

export function Login() {
	const [serviceUrl, setServiceUrl] = useState("https://bsky.social");
	const [identifier, setIdentifier] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>();
	useEffect(() => {
		const handle = sessionStorage.getItem(CHANGE_USER_KEY);
		if (handle != null) {
			setIdentifier(handle);
		}
		sessionStorage.removeItem(CHANGE_USER_KEY);
	}, []);
	const handleLogin = async () => {
		if (!URL.canParse(serviceUrl)) return setError("cannot parse url");
		try {
			await signIn(new URL(serviceUrl), identifier, password);
			location.href = "/";
		} catch (e) {
			setError(String(e));
		}
	};
	return (
		<>
			<label>
				service url:
				<input
					type="text"
					autoComplete="off"
					autoCorrect="off"
					value={serviceUrl}
					onChange={(ev) => setServiceUrl(ev.target.value)}
				/>
			</label>
			<br />
			<label>
				handle:
				<input
					type="text"
					autoComplete="username"
					autoCorrect="off"
					value={identifier}
					onChange={(ev) => setIdentifier(ev.target.value)}
				/>
			</label>
			<br />
			<label>
				password:
				<input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
			</label>
			<br />
			<button type="button" onClick={handleLogin}>
				login
			</button>
			<br />
			{error}
		</>
	);
}
