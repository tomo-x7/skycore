/**
 * GENERATED CODE - DO NOT MODIFY
 */

import type {
	ComAtprotoRepoCreateRecord,
	ComAtprotoRepoDeleteRecord,
	ComAtprotoRepoGetRecord,
	ComAtprotoRepoListRecords,
	ComAtprotoRepoPutRecord,
} from "@atproto/api";
import { type FetchHandler, type FetchHandlerOptions, XrpcClient } from "@atproto/xrpc";
import { schemas } from "./lexicons.js";
import type * as WinTomoXAtunitsUnit from "./types/win/tomo-x/atunits/unit.js";
import type { OmitKey, Un$Typed } from "./util.js";

export * as WinTomoXAtunitsUnit from "./types/win/tomo-x/atunits/unit.js";

export class AtpBaseClient extends XrpcClient {
	win: WinNS;

	constructor(options: FetchHandler | FetchHandlerOptions) {
		super(options, schemas);
		this.win = new WinNS(this);
	}

	/** @deprecated use `this` instead */
	get xrpc(): XrpcClient {
		return this;
	}
}

export class WinNS {
	_client: XrpcClient;
	tomoX: WinTomoXNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.tomoX = new WinTomoXNS(client);
	}
}

export class WinTomoXNS {
	_client: XrpcClient;
	atunits: WinTomoXAtunitsNS;

	constructor(client: XrpcClient) {
		this._client = client;
		this.atunits = new WinTomoXAtunitsNS(client);
	}
}

export class WinTomoXAtunitsNS {
	_client: XrpcClient;
	unit: WinTomoXAtunitsUnitRecord;

	constructor(client: XrpcClient) {
		this._client = client;
		this.unit = new WinTomoXAtunitsUnitRecord(client);
	}
}

export class WinTomoXAtunitsUnitRecord {
	_client: XrpcClient;

	constructor(client: XrpcClient) {
		this._client = client;
	}

	async list(params: OmitKey<ComAtprotoRepoListRecords.QueryParams, "collection">): Promise<{
		cursor?: string;
		records: { uri: string; value: WinTomoXAtunitsUnit.Record }[];
	}> {
		const res = await this._client.call("com.atproto.repo.listRecords", {
			collection: "win.tomo-x.atunits.unit",
			...params,
		});
		return res.data;
	}

	async get(
		params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, "collection">,
	): Promise<{ uri: string; cid: string; value: WinTomoXAtunitsUnit.Record }> {
		const res = await this._client.call("com.atproto.repo.getRecord", {
			collection: "win.tomo-x.atunits.unit",
			...params,
		});
		return res.data;
	}

	async create(
		params: OmitKey<ComAtprotoRepoCreateRecord.InputSchema, "collection" | "record">,
		record: Un$Typed<WinTomoXAtunitsUnit.Record>,
		headers?: Record<string, string>,
	): Promise<{ uri: string; cid: string }> {
		const collection = "win.tomo-x.atunits.unit";
		const res = await this._client.call(
			"com.atproto.repo.createRecord",
			undefined,
			{ collection, ...params, record: { ...record, $type: collection } },
			{ encoding: "application/json", headers },
		);
		return res.data;
	}

	async put(
		params: OmitKey<ComAtprotoRepoPutRecord.InputSchema, "collection" | "record">,
		record: Un$Typed<WinTomoXAtunitsUnit.Record>,
		headers?: Record<string, string>,
	): Promise<{ uri: string; cid: string }> {
		const collection = "win.tomo-x.atunits.unit";
		const res = await this._client.call(
			"com.atproto.repo.putRecord",
			undefined,
			{ collection, ...params, record: { ...record, $type: collection } },
			{ encoding: "application/json", headers },
		);
		return res.data;
	}

	async delete(
		params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
		headers?: Record<string, string>,
	): Promise<void> {
		await this._client.call(
			"com.atproto.repo.deleteRecord",
			undefined,
			{ collection: "win.tomo-x.atunits.unit", ...params },
			{ headers },
		);
	}
}
