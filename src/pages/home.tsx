import { NewPostView } from "../components/NewPost";
import { MobileNewPostButton } from "../components/MobileNewPostButton";

export function Home() {
	return (
		<>
			<div>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
					<div key={v}>post {v}</div>
				))}
				<MobileNewPostButton />
			</div>
		</>
	);
}
