import { useParams } from "react-router-dom";

export function Post() {
	const { user, rkey } = useParams();
	return (
		<>
			{user}'s {rkey}post
		</>
	);
}

function PostView() {}
