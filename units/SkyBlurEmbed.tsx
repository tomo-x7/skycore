import type { AppBskyFeedPost } from "@atproto/api";
import type { UnitArgs, UnitDefaultArgs } from "./type";
import { getRecord, isExternalEmbed } from "./util";

export default function SkyBlurEmbedOuter(args: UnitArgs["embed"]) {
	const React = args.React;
	if (!isExternalEmbed(args.post.embed)) return null;
	if (!isSkyBlurPost(args.post.record)) return null;
	if (args.post.record["uk.skyblur.post.visibility"] !== "public") return null;
	return <SkyBlurEmbed {...args} record={args.post.record} />;
}
function SkyBlurEmbed({ React, post, fetcher, record }: UnitArgs["embed"] & { record: SkyBlurRecord }) {
	const skyblurDataRef = React.useRef<Promise<SkyBlurData | null>>(null);
	React.useEffect(() => {
		if (skyblurDataRef.current == null) {
			skyblurDataRef.current = fetchSkyBlurData(record, fetcher, post.author.did);
		}
	}, [skyblurDataRef, record, fetcher, post]);
	if (!isExternalEmbed(post.embed)) return null;
	return (
		<div className="win-tomo-x-skycore-unit-skyblurembed">
			{skyblurDataRef.current ? (
				<React.Suspense fallback={<div className="loading">loading</div>}>
					<SkyBlurEmbedInner dataPromise={skyblurDataRef.current} React={React} />
				</React.Suspense>
			) : (
				<div className="loading">loading</div>
			)}
		</div>
	);
}
function SkyBlurEmbedInner({
	dataPromise,
	React,
}: {
	dataPromise: Promise<SkyBlurData | null>;
	React: UnitDefaultArgs["React"];
}) {
	const data = React.use(dataPromise);
	const [open, setOpen] = React.useState(false);
	const [adOpen, setAdOpen] = React.useState(false);
	if (data == null) return <div>Failed to load SkyBlur data</div>;
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

async function fetchSkyBlurData(
	record: SkyBlurRecord,
	fetcher: UnitDefaultArgs["fetcher"],
	authorDid: string,
): Promise<SkyBlurData | null> {
	const { pdsEndpoint } = await fetcher.resolveDid(authorDid);
	const data = await getRecord<SkyBlurData>(pdsEndpoint, record["uk.skyblur.post.uri"]);
	return data;
}

function isSkyBlurPost(postRecord: { [key: string]: unknown }): postRecord is SkyBlurRecord {
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

type SkyBlurData = {
	text: string;
	additional?: string;
};
type SkyBlurRecord = {
	"uk.skyblur.post.uri": string;
	"uk.skyblur.post.visibility": "public" | "password";
} & AppBskyFeedPost.Record;
