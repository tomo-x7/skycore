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
					autoComplete="off"
					autoCorrect="off"
					onChange={(ev) => setServiceUrl(ev.target.value)}
					type="text"
					value={serviceUrl}
				/>
			</label>
			<br />
			<label>
				handle:
				<input
					autoComplete="username"
					autoCorrect="off"
					onChange={(ev) => setIdentifier(ev.target.value)}
					type="text"
					value={identifier}
				/>
			</label>
			<br />
			<label>
				password:
				<input onChange={(ev) => setPassword(ev.target.value)} type="password" value={password} />
			</label>
			<br />
			<button onClick={handleLogin} type="button">
				login
			</button>
			<br />
			{error}
		</>
	);
}
