import { type AppBskyFeedPost, RichText } from "@atproto/api";
import type { SelfLabel } from "@atproto/api/dist/client/types/com/atproto/label/defs";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa6";
import { PieChart } from "react-minimal-pie-chart";
import { logger } from "../fetcher/logger";
import { useProfile } from "../lib/contexts/profile";
import { getRichTextView } from "../lib/richtext";

type PostFunc = (params: {
	content: RichText;
	embed?: AppBskyFeedPost.Record["embed"];
	reply?: AppBskyFeedPost.Record["reply"];
	langs?: string[];
	labels?: SelfLabel[];
}) => Promise<{ ok: true } | { ok: false; error: string }>;

export function NewPost({ close, initText }: { close: () => void; initText?: string }) {
	const post: PostFunc = async ({ content, embed, reply, langs, labels }) => {
		try {
			await content.detectFacets(fetcher.rawAgent);
			await fetcher.rawAgent.post({
				$type: "app.bsky.feed.post",
				embed,
				facets: content.facets,
				labels: labels == null ? undefined : { $type: "com.atproto.label.defs#selfLabels", values: labels },
				langs,
				reply,
				text: content.text,
			});
			return { ok: true };
		} catch (e) {
			logger.error(`Failed to post: ${String(e)}`);
			return { error: String(e), ok: false };
		}
	};
	return <>{<NewPostView close={close} initText={initText} post={post} />}</>;
}

export function NewPostView({ post, initText = "", close }: { post: PostFunc; initText?: string; close: () => void }) {
	const [text, setText] = useState(initText);
	const [error, setError] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const { avatar } = useProfile();
	const handlePost = async () => {
		if (loading) return;
		try {
			if (text.length < 1) return;
			if (text.length > 300) return;
			setError(false);
			setLoading(true);
			const rt = new RichText({ text });
			const res = await post({ content: rt });
			if (!res.ok) {
				setError(true);
				return;
			}
			toast.success("投稿しました");
			close();
		} catch (e) {
			console.error("Failed to post:", e);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (value: string) => {
		setText(value);
	};
	return (
		<div
			className="fixed flex justify-center"
			style={{
				alignItems: "start",
				backgroundColor: "#0008",
				inset: 0,
			}}
		>
			<div style={{ backgroundColor: "white", borderRadius: 8, marginTop: 50 }}>
				<div
					className="flex items-center"
					style={{ gap: 20, height: 50, justifyContent: "space-between", paddingLeft: 4, paddingRight: 4 }}
				>
					<button
						onClick={close}
						style={{
							backgroundColor: "white",
							border: 0,
							borderRadius: 999,
							color: "blue",
							fontSize: 12,
							fontWeight: "bold",
							padding: "7px 9px",
						}}
						type="button"
					>
						キャンセル
					</button>
					<div style={{ color: "red", flexGrow: 1, textAlign: "right" }}>
						{error && "エラーが発生しました"}
					</div>
					<button
						className="flex"
						disabled={text.length < 1 || loading}
						onClick={handlePost}
						style={{
							backgroundColor: "blue",
							border: 0,
							borderRadius: 999,
							color: "white",
							fontSize: 12,
							fontWeight: "bold",
							padding: "7px 9px",
						}}
						type="button"
					>
						{loading ? "" : "投稿"}
					</button>
				</div>
				<div className="flex items-start">
					<img height={50} src={avatar} style={{ borderRadius: 999 }} width={50} />
					<Textarea onChange={handleChange} value={text} />
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
		<div style={{ maxHeight: "calc(90dvh-100px)", minHeight: 140, overflowY: "auto", padding: 12, width: 500 }}>
			<div className="relative" style={{ height: "100%" }}>
				<textarea
					className="absolute"
					onChange={(ev) => onChange(ev.target.value)}
					onClick={(e) => e.stopPropagation()}
					style={{
						background: "none",
						border: 0,
						caret: "black",
						caretColor: "black",
						color: "transparent",
						fontSize: 16,
						height: "100%",
						left: 0,
						lineHeight: 1.2,
						margin: 0,
						outline: 0,
						padding: 0,
						resize: "none",
						top: 0,
						width: "100%",
					}}
					value={value}
				/>
				<div
					aria-hidden="true"
					style={{
						color: value ? "black" : "gray",
						cursor: "none",
						fontSize: 16,
						lineHeight: 1.2,
						margin: 0,
						overflow: "hidden",
						padding: 0,
						whiteSpace: "pre-wrap",
						wordWrap: "break-word",
						zIndex: 1,
					}}
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
			data={[
				{ color: "#1083fe", value: text.length },
				{ color: isOverflow ? "#f00" : "#d4dbe2", value: 300 - text.length },
			]}
			lineWidth={30}
			startAngle={-90}
			style={{ width: 30 }}
			// segmentsStyle={(i) => (isOverflow && i === 1 && { strokeWidth: 50 }) || undefined}
			// segmentsShift={(i) => (isOverflow && i === 1 && -25) || undefined}
		/>
	);
}
