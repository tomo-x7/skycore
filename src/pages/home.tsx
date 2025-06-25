import { MobileNewPostButton } from "../components/MobileNewPostButton";
import { Drawer } from "../components/Drawer/";
import "./home.css";
import { Header } from "../components/Header";

export function Home() {
	return (
		<>
			<div className="home">
				<Header />
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
					<div key={v}>post {v}</div>
				))}
				<MobileNewPostButton />
			</div>
		</>
	);
}
