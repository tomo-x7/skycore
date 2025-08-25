import type { AppBskyFeedPost } from "@atproto/api";
import type { UnitArgs, UnitConfig, UnitDefaultArgs } from "./type";
import { getRecord, isExternalEmbed } from "./util";
import { MdOpenInNew } from "react-icons/md";

export const config: UnitConfig = {
	css: ["SkyblurEmbed.css"],
};
export default function SkyblurEmbedOuter(args: UnitArgs["embed"]) {
	const React = args.React;
	if (!isExternalEmbed(args.post.embed)) return null;
	if (!isSkyblurPost(args.post.record)) return null;
	if (args.post.record["uk.skyblur.post.visibility"] !== "public") return null;
	return (
		<div className="win-tomo-x-skycore-unit-skyblurembed">
			<SkyblurEmbed {...args} record={args.post.record} />
		</div>
	);
}
function SkyblurEmbed({ React, post, fetcher, record }: UnitArgs["embed"] & { record: SkyblurRecord }) {
	const [data, setData] = React.useState<SkyblurData | null>(null);
	React.useEffect(() => {
		fetchSkyblurData(record, fetcher, post.author.did).then(setData);
	}, [record, fetcher, post]);
	const [open, setOpen] = React.useState(false);
	const adLength = data?.additional?.length ?? 0;
	const [adOpen, setAdOpen] = React.useState(adLength > 100);
	if (!isExternalEmbed(post.embed)) return null;
	if (data == null) return <div className="loading">loading</div>;
	return (
		<>
			<div className="main">
				{open ? (
					<div className="content">
						{data.text.replace(/\[|\]/g, "")}
						{data.additional && (
							<>
								<hr />
								{adOpen ? (
									<div className="additional">{data.additional}</div>
								) : (
									<button className="openadditional" type="button" onClick={() => setAdOpen(true)}>
										補足を表示
									</button>
								)}
							</>
						)}
					</div>
				) : (
					<button className="open" type="button" onClick={() => setOpen((prev) => !prev)}>
						Skyblurで伏せられた内容を表示
					</button>
				)}
			</div>
			<a href={post.embed.external.uri} target="_blank" rel="noopener noreferrer" className="link">
				Skyblurで表示
				<MdOpenInNew />
			</a>
		</>
	);
}

async function fetchSkyblurData(
	record: SkyblurRecord,
	fetcher: UnitDefaultArgs["fetcher"],
	authorDid: string,
): Promise<SkyblurData | null> {
	const { pdsEndpoint } = await fetcher.resolveDid(authorDid);
	const data = await getRecord<SkyblurData>(pdsEndpoint, record["uk.skyblur.post.uri"]);
	return data;
}

function isSkyblurPost(postRecord: { [key: string]: unknown }): postRecord is SkyblurRecord {
	if (
		typeof postRecord["uk.skyblur.post.uri"] === "string" &&
		postRecord["uk.skyblur.post.uri"].startsWith("at://") &&
		(postRecord["uk.skyblur.post.visibility"] === "public" ||
			postRecord["uk.skyblur.post.visibility"] === "password")
	) {
		return true;
	}
	return false;
}

type SkyblurData = {
	text: string;
	additional?: string;
};
type SkyblurRecord = {
	"uk.skyblur.post.uri": string;
	"uk.skyblur.post.visibility": "public" | "password";
} & AppBskyFeedPost.Record;
