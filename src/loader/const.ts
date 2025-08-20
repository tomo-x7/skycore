import { AtUri } from "@atproto/api";
import type { UnitList } from "../../units/config";
import type { UnitUris } from "./types";

export const DEFAULT_UNIT_URIS: UnitUris = {
	TLPost: new AtUri("at://did:plc:qcwvyds5tixmcwkwrg3hxgxd/win.tomo-x.atunits.unit/TLPost"),
	embed: [],
} as const;
export const UNIT_URIS_KEY = "UNIT_URIS";

export const REACT_VER = "React@19.1.1" as const;

export const UNIT_VERS: { [k in keyof UnitList]: string } = {
	TLPost: "win.tomo-x.skycore.unit.TLPostv1",
	embed: "win.tomo-x.skycore.unit.embedv1",
};
