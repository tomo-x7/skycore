import { RichText } from "@atproto/api";

export function getRichTextView(text: string) {
	const rt = new RichText({ text });
	rt.detectFacetsWithoutResolution();
	const facets = rt.facets ?? [];
	const codeArr = Array.from(rt.unicodeText.utf8).map((c) => ({ c, blue: false }));
	for (const facet of facets) {
		for (let i = facet.index.byteStart; i < facet.index.byteEnd; i++) {
			if (codeArr[i] != null) codeArr[i].blue = true;
		}
	}
	const decoder = new TextDecoder();
	const view = codeArr
		.reduce<{ s: number[]; blue: boolean }[]>((p, c) => {
			const last = p.at(-1);
			if (last?.blue === c.blue) {
				last.s = [...last.s, c.c];
			} else {
				p.push({ s: [c.c], blue: c.blue });
			}
			return p;
		}, [])
		.map((v) => ({ s: decoder.decode(new Uint8Array(v.s)), blue: v.blue }));
	return view;
}
