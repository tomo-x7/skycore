import { useState } from "react";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa6";
import { useSession } from "../lib/contexts/session";
import { useProfile } from "../lib/contexts/profile";

export function NewPost({ post, initText = "" }: { post: (text:string) => Promise<void>; initText?: string }) {
	const [text, setText] = useState(initText);
	const {avatar}=useProfile()
	const handle=async()=>{
		if(text.length<1)return;
		await post(text)
		toast.success("投稿を公開しました")
	}
	return (
		<div className="fixed inset-0 bg-black/80 flex justify-center items-center">
			<div className="bg-white">
				<img src={avatar} />
				<textarea value={text} onChange={(ev) => setText(ev.target.value)} placeholder="最近どう？" />
				<hr />
				<button type="button"><FaImage /></button>
			</div>
		</div>
	);
}
