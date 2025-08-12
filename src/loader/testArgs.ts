import type { RawUnitArgs } from "./types";

export const UNIT_TEST_ARGS: RawUnitArgs = {
	TLPost: {
		post: {
			uri: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3jt6walwmos2y",
			cid: "bafyreih2ppgdoc5jhjsbj5yxvqezymbndbe522vexpiic6l72o3ge7tswy",
			author: {
				did: "did:plc:z72i7hdynmk6r22z27h6tvur",
				handle: "bsky.app",
				displayName: "Bluesky",
				avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreihagr2cmvl2jt4mgx3sppwe2it3fwolkrbtjrhcnwjk4jdijhsoze@jpeg",
				associated: {
					chat: { allowIncoming: "none" },
					activitySubscription: { allowSubscriptions: "followers" },
				},
				viewer: {
					muted: false,
					blockedBy: false,
					following: "at://did:plc:qcwvyds5tixmcwkwrg3hxgxd/app.bsky.graph.follow/3kltws3vlix24",
				},
				labels: [],
				createdAt: "2023-04-12T04:53:57.057Z",
				verification: { verifications: [], verifiedStatus: "none", trustedVerifierStatus: "valid" },
			},
			record: {
				$type: "app.bsky.feed.post",
				createdAt: "2023-04-12T17:36:42.427Z",
				embed: {
					$type: "app.bsky.embed.images",
					images: [
						{
							alt: "",
							image: {
								$type: "blob",
								ref: { $link: "bafkreidf3ystxebv33boyb5hr2ggwmlee5x53vubwelsuvmcw3tq4p36pi" },
								mimeType: "image/jpeg",
								size: 148647,
							},
						},
					],
				},
				text: "How it started:",
			},
			embed: {
				$type: "app.bsky.embed.images#view",
				images: [
					{
						thumb: "https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreidf3ystxebv33boyb5hr2ggwmlee5x53vubwelsuvmcw3tq4p36pi@jpeg",
						fullsize:
							"https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreidf3ystxebv33boyb5hr2ggwmlee5x53vubwelsuvmcw3tq4p36pi@jpeg",
						alt: "",
					},
				],
			},
			replyCount: 29,
			repostCount: 182,
			likeCount: 813,
			quoteCount: 29,
			indexedAt: "2023-04-12T17:36:42.427Z",
			viewer: { threadMuted: false, embeddingDisabled: false },
			labels: [],
		},
		isReply: undefined,
		hasReply: undefined,
		longReply: undefined,
	},
};
