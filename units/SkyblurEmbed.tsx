import type { AppBskyFeedPost } from "@atproto/api";
import type { UnitArgs, UnitDefaultArgs } from "./type";
import { getRecord, isExternalEmbed } from "./util";

export default function SkyblurEmbedOuter(args: UnitArgs["embed"]) {
	const React = args.React;
	if (!isExternalEmbed(args.post.embed)) return null;
	if (!isSkyblurPost(args.post.record)) return null;
	if (args.post.record["uk.skyblur.post.visibility"] !== "public") return null;
	return <SkyblurEmbed {...args} record={args.post.record} />;
}
function SkyblurEmbed({ React, post, fetcher, record }: UnitArgs["embed"] & { record: SkyblurRecord }) {
	const skyblurDataRef = React.useRef<Promise<SkyblurData | null>>(null);
	React.useEffect(() => {
		if (skyblurDataRef.current == null) {
			skyblurDataRef.current = fetchSkyblurData(record, fetcher, post.author.did);
		}
	}, [skyblurDataRef, record, fetcher, post]);
	if (!isExternalEmbed(post.embed)) return null;
	return (
		<div className="win-tomo-x-skycore-unit-skyblurembed">
			(
			<React.Suspense fallback={<div className="loading">loading</div>}>
				<SkyblurEmbedInner dataPromise={skyblurDataRef.current} React={React} />
			</React.Suspense>
			)
		</div>
	);
}
function SkyblurEmbedInner({
	dataPromise,
	React,
}: {
	dataPromise: Promise<SkyblurData | null> | null;
	React: UnitDefaultArgs["React"];
}) {
	const data = dataPromise && React.use(dataPromise);
	const [open, setOpen] = React.useState(false);
	const [adOpen, setAdOpen] = React.useState(false);
	if (data == null) return <div>Failed to load Skyblur data</div>;
	return (
		<div>
			<button type="button" onClick={() => setOpen((prev) => !prev)}>
				Skyblurで伏せられた内容を表示
			</button>
			{open && <div>{data.text}</div>}
			{data.additional &&
				(adOpen ? (
					<div>{data.additional}</div>
				) : (
					<button type="button" onClick={() => setAdOpen(true)}>
						補足を表示
					</button>
				))}
		</div>
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
