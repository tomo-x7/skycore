import { useParams } from "react-router-dom";

export function Profile() {
	const { user } = useParams();
	return <>{user}'s profile</>;
}
