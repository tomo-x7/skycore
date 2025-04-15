import { useState } from "react";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa6";
import { PieChart } from "react-minimal-pie-chart";
import { useProfile } from "../lib/contexts/profile";

export function NewPost({ post, initText = "" }: { post: (text: string) => Promise<void>; initText?: string }) {
	const [text, setText] = useState(initText);
	const { avatar } = useProfile();
	const handle = async () => {
		if (text.length < 1) return;
		await post(text);
		toast.success("投稿を公開しました");
	};
	return (
		<div className="fixed inset-0 bg-black/80 flex justify-center items-center">
			<div className="bg-white mobile:bg-black">
				<img src={avatar} width={50} height={50} className="rounded-full" />
				<Textarea value={text} onChange={(value) => setText(value)} />
				<hr />
				<div className="flex justify-between">
					<div>
						<button type="button">
							<FaImage />
						</button>
					</div>
					<div className="flex">
						<div style={{ color: text.length > 300 ? "red" : "black" }}>{300 - text.length}</div>
						<TextCountChart text={text} />
					</div>
				</div>
			</div>
		</div>
	);
}

function Textarea({ value, onChange }: { value: string; onChange: (value: string) => void }) {
	return (
		<div className="w-[500px] max-h-[calc(90dvh-100px)] min-h-[140px] overflow-y-auto p-3">
			<div className="relative">
				<div
					className="overflow-hidden whitespace-pre-wrap wrap-break-word"
					style={{ color: value ? "black" : "gray" }}
					aria-hidden="true"
				>
					{value || "最近どう？"}
					{"\u200b"}
				</div>
				<textarea
					className="absolute left-0 top-0 w-full h-full resize-none outline-0 text-transparent caret-black"
					value={value}
					onChange={(ev) => onChange(ev.target.value)}
				/>
			</div>
		</div>
	);
}

function TextCountChart({ text }: { text: string }) {
	const isOverflow = text.length > 300;
	return (
		<PieChart
			className="w-[30px]"
			lineWidth={30}
			startAngle={-90}
			data={[
				{ value: text.length, color: "#1083fe" },
				{ value: 300 - text.length, color: isOverflow ? "#f00" : "#d4dbe2" },
			]}
			// segmentsStyle={(i) => (isOverflow && i === 1 && { strokeWidth: 50 }) || undefined}
			// segmentsShift={(i) => (isOverflow && i === 1 && -25) || undefined}
		/>
	);
}
