import { NewPost } from "../components/NewPost";

export function Home() {
	return (
		<>
			<div>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
					<div key={v}>post {v}</div>
				))}
				<NewPost post={async () => void 0} />
			</div>
		</>
	);
}
