import { validate as _validate } from "../../../../lexicons";
import { is$typed as _is$typed } from "../../../../util";

const is$typed = _is$typed,
	validate = _validate;
const id = "win.tomo-x.atunits.unit";

export interface Record {
	$type: "win.tomo-x.atunits.unit";
	/** Supported library versions (such as React). `React` indicates support for any version of React, while `React@19.0` indicates support for React 19.0.x. */
	libver: string[];
	/** URL of the Unit body. */
	src: string;
	/** Targets supported by this Unit. Written in `.well-known/atunits.json`. Example: `win.tomo-x.skycore.unit.postv1` */
	target: string[];
	/** Name of the Unit */
	name?: string;
	[k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
	return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
	return validate<Record & V>(v, id, hashRecord, true);
}
