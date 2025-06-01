import { RichText } from "@atproto/api";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa6";
import { PieChart } from "react-minimal-pie-chart";
import { useProfile } from "../lib/contexts/profile";
import { getRichTextView } from "../lib/richtext";

export function NewPost({
	post,
	initText = "",
	close,
	detectFatet,
}: {
	post: (content: RichText) => Promise<void>;
	detectFatet: (RichText: RichText) => Promise<void>;
	initText?: string;
	close: () => void;
}) {
	const [text, setText] = useState(initText);
	const { avatar } = useProfile();
	const handlePost = async () => {
		if (text.length < 1) return;
		const rt = new RichText({ text });
		await detectFatet(rt);
		await post(rt);
		toast.success("投稿を公開しました");
	};
	const handleChange = (value: string) => {
		setText(value);
	};
	return (
		<div
			className="fixed flex justify-center"
			style={{
				inset: 0,
				backgroundColor: "#0008",
				alignItems: "start",
			}}
		>
			<div style={{ backgroundColor: "white", marginTop: 50, borderRadius: 8 }}>
				<div
					className="flex items-center"
					style={{ paddingLeft: 4, paddingRight: 4, justifyContent: "space-between", height: 50 }}
				>
					<button
						type="button"
						onClick={close}
						style={{
							color: "blue",
							padding: "7px 9px",
							fontWeight: "bold",
							borderRadius: 999,
							fontSize: 12,
							backgroundColor: "white",
						}}
					>
						キャンセル
					</button>
					<button
						type="button"
						onClick={handlePost}
						className="flex"
						style={{
							color: "white",
							backgroundColor: "blue",
							padding: "7px 9px",
							borderRadius: 999,
							fontWeight: "bold",
							fontSize: 12,
						}}
						disabled={text.length < 1}
					>
						投稿
					</button>
				</div>
				<div className="flex items-start">
					<img src={avatar} width={50} height={50} style={{ borderRadius: 999 }} />
					<Textarea value={text} onChange={handleChange} />
				</div>
				<hr />
				<div className="flex" style={{ justifyContent: "space-between" }}>
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
	const rtView = useMemo(() => getRichTextView(value), [value]);
	const textEl = rtView.map(({ s, blue }, i) => (
		<span key={i + s} style={{ color: blue ? "blue" : "black" }}>
			{s}
		</span>
	));
	return (
		<div style={{ width: 500, maxHeight: "calc(90dvh-100px)", minHeight: 140, overflowY: "auto", padding: 12 }}>
			<div className="relative" style={{ height: "100%" }}>
				<textarea
					className="absolute"
					onClick={(e) => e.stopPropagation()}
					style={{
						left: 0,
						top: 0,
						width: "100%",
						height: "100%",
						resize: "none",
						outline: 0,
						caret: "black",
						fontSize: 16,
						border: 0,
						padding: 0,
						margin: 0,
						background: "none",
						color: "transparent",
						caretColor: "black",
						lineHeight: 1.2,
					}}
					value={value}
					onChange={(ev) => onChange(ev.target.value)}
				/>
				<div
					style={{
						color: value ? "black" : "gray",
						overflow: "hidden",
						whiteSpace: "pre-wrap",
						wordWrap: "break-word",
						fontSize: 16,
						padding: 0,
						margin: 0,
						cursor: "none",
						zIndex: 1,
						lineHeight: 1.2,
					}}
					aria-hidden="true"
				>
					{textEl || "最近どう？"}
					{"\u200b"}
				</div>
			</div>
		</div>
	);
}

function TextCountChart({ text }: { text: string }) {
	const isOverflow = text.length > 300;
	return (
		<PieChart
			style={{ width: 30 }}
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
