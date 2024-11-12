import {
	type AppBskyEmbedExternal,
	type AppBskyEmbedImages,
	type AppBskyEmbedRecord,
	type AppBskyEmbedRecordWithMedia,
	type AppBskyEmbedVideo,
	RichText,
} from "@atproto/api";
import { useState } from "react";
import { useUnitDefaultParams, type UnitDefaultParams } from "./App";

type postRef = { uri: string; cid: string };
type openParam = {
	reply?: { root: postRef; parent: postRef };
	quote?: { record: postRef };
	init?: string;
};
type embed =
	| AppBskyEmbedImages.Main
	| AppBskyEmbedVideo.Main
	| AppBskyEmbedExternal.Main
	| AppBskyEmbedRecord.Main
	| AppBskyEmbedRecordWithMedia.Main;
let setView: React.Dispatch<React.SetStateAction<false | openParam>> | undefined = undefined;

export function openNewPost(param?: openParam) {
	setView?.(param ?? {});
}

export function NewPost() {
	const [isView, thisSetView] = useState<false | openParam>(false);
	setView = thisSetView;
	const closeUnit = () => setView?.(false);
	return isView === false ? <></> : <NewPostUnit {...isView} {...useUnitDefaultParams()} closeUnit={closeUnit} />;
}

function NewPostUnit({
	agent,
	reply,
	quote,
	init,
	closeUnit,
}: openParam & UnitDefaultParams & { closeUnit: () => void }) {
	const [text, setText] = useState<string>(init ?? "");
	const [lang, setLang] = useState<string>("ja");
	const onCloseClick = () => {
		if (text !== "") {
			const conf = window.confirm("下書きを破棄しますか？");
			if (!conf) {
				return;
			}
		}
		closeUnit();
	};
	const onInput = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(ev.target.value);
	};
	const post = async () => {
		const rt = new RichText({ text });
		await rt.detectFacets(agent);
		let embed: embed | undefined = undefined;
		if (quote) {
			embed = quote;
			embed.$type = "app.bsky.embed.record";
		}
		await agent.post({ text: rt.text, facets: rt.facets, langs: [lang], reply, embed }); //labels:{values:[{val:""}]}
		setText("");
		closeUnit();
	};
	return (
		<>
			<div
				onClick={onCloseClick}
				style={{
					position: "fixed",
					inset: 0,
					display: "flex",
					backgroundColor: "#0008",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div onClick={(ev) => ev.stopPropagation()} style={{ backgroundColor: "white" }}>
					create new post
					<textarea onChange={onInput} value={text} />
					<button type="button" onClick={post} disabled={text === ""}>
						post
					</button>
				</div>
			</div>
		</>
	);
}
