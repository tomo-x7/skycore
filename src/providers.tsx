import type { CredentialSession } from "@atproto/api";
import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: PropsWithChildren<{ session: CredentialSession }>) {
	return (
		<>
			{children}
			<Toaster position="bottom-left" />
		</>
	);
}
