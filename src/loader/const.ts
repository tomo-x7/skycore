import { AtUri } from "@atproto/api";
import type { UnitUris,  } from "./types";

export const UNIT_KEYS = ["TLPost"] as const;
export const DEFAULT_UNIT_URIS: UnitUris = {
	TLPost: new AtUri("at://did:plc:qcwvyds5tixmcwkwrg3hxgxd/win.tomo-x.atunits.unit/TLPost"),
} as const;
export const UNIT_URIS_KEY = "UNIT_URIS";

export const REACT_VER = "React@19.1.1" as const;

export const UNIT_VERS: {[k in typeof UNIT_KEYS[number]]: string} = {
	TLPost: "win.tomo-x.skycore.unit.TLPostv1",
};