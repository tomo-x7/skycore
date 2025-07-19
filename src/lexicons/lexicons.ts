/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type LexiconDoc, Lexicons, ValidationError, type ValidationResult } from "@atproto/lexicon";
import { is$typed, maybe$typed } from "./util.js";

const schemaDict = {
	WinTomo_xAtunitsUnit: {
		lexicon: 1,
		id: "win.tomo-x.atunits.unit",
		defs: {
			main: {
				description: "Definition for loading Units with ATUnits.",
				key: "any",
				record: {
					properties: {
						libver: {
							description:
								"Supported library versions (such as React). `React` indicates support for any version of React, while `React@19.0` indicates support for React 19.0.x.",
							items: {
								type: "string",
							},
							type: "array",
						},
						src: {
							description: "URL of the Unit body.",
							format: "uri",
							type: "string",
						},
						target: {
							description:
								"Targets supported by this Unit. Written in `.well-known/atunits.json`. Example: `win.tomo-x.skycore.unit.postv1`",
							items: {
								format: "nsid",
								type: "string",
							},
							type: "array",
						},
						name: {
							type: "string",
							description: "Name of the Unit",
						},
					},
					required: ["libver", "target", "src"],
					type: "object",
				},
				type: "record",
			},
		},
	},
} as const satisfies Record<string, LexiconDoc>;
const schemas = Object.values(schemaDict) satisfies LexiconDoc[];
export const lexicons: Lexicons = new Lexicons(schemas);

export function validate<T extends { $type: string }>(
	v: unknown,
	id: string,
	hash: string,
	requiredType: true,
): ValidationResult<T>;
export function validate<T extends { $type?: string }>(
	v: unknown,
	id: string,
	hash: string,
	requiredType?: false,
): ValidationResult<T>;
export function validate(v: unknown, id: string, hash: string, requiredType?: boolean): ValidationResult {
	return (requiredType ? is$typed : maybe$typed)(v, id, hash)
		? lexicons.validate(`${id}#${hash}`, v)
		: {
				success: false,
				error: new ValidationError(
					`Must be an object with "${hash === "main" ? id : `${id}#${hash}`}" $type property`,
				),
			};
}
