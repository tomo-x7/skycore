import { AtUri } from "@atproto/api";
import { memo, useState } from "react";
import { MULTI_UNIT_KEYS, SINGLE_UNIT_KEYS } from "../../units/config";
import type { Loader, MultiUnitUris, SingleUnitUris, UnitUris } from "../loader/types";

const setSingleUri =
	(setUnitUris: React.Dispatch<React.SetStateAction<UnitUris>>, key: keyof SingleUnitUris) => (uri: AtUri) => {
		setUnitUris((prev) => ({
			...prev,
			[key]: uri,
		}));
	};
const setMultiUri =
	(setUnitUris: React.Dispatch<React.SetStateAction<UnitUris>>, key: keyof MultiUnitUris) => (uris: AtUri[]) => {
		setUnitUris((prev) => ({
			...prev,
			[key]: uris,
		}));
	};
export function UnitConfig({ loader }: { loader: Loader }) {
	const [unitUris, setUnitUris] = useState<UnitUris>(loader.unitUris);
	const [anyInvalids, setAnyInvalids] = useState<{ [key: string]: boolean }>({});
	const allValid = Object.values(anyInvalids).every((v) => v === false);

	return (
		<>
			{SINGLE_UNIT_KEYS.map((key) => (
				<SingleUnitConfig
					key={key}
					unitKey={key}
					uri={unitUris[key]}
					setUri={setSingleUri(setUnitUris, key)}
					setAnyInvalids={setAnyInvalids}
				/>
			))}
			{MULTI_UNIT_KEYS.map((key) => (
				<MultiUnitConfig
					key={key}
					unitKey={key}
					uris={unitUris[key]}
					setUris={setMultiUri(setUnitUris, key)}
					setAnyInvalids={setAnyInvalids}
				/>
			))}
			{JSON.stringify(unitUris)}
			{!allValid && <div style={{ color: "red" }}>Some URIs are invalid</div>}
		</>
	);
}

const SingleUnitConfig = memo(function SingleUnitConfig({
	uri,
	setUri,
	unitKey,
	setAnyInvalids,
}: {
	unitKey: keyof SingleUnitUris;
	uri: AtUri;
	setUri: (uri: AtUri) => void;
	setAnyInvalids: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}) {
	const [value, setValue] = useState(uri.toString());
	const [invalid, setInvalid] = useState(false);
	const onBlur = () => {
		try {
			setUri(new AtUri(value));
			setInvalid(false);
			setAnyInvalids((prev) => ({ ...prev, [unitKey]: false }));
		} catch (error) {
			console.error("Invalid URI:", error);
			setInvalid(true);
			setAnyInvalids((prev) => ({ ...prev, [unitKey]: true }));
		}
	};
	return (
		<div>
			{unitKey}: <input value={value} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />
			{invalid && <span style={{ color: "red" }}> Invalid URI</span>}
		</div>
	);
});
const MultiUnitConfig = memo(function MultiUnitConfig({
	unitKey,
	uris,
	setUris,
	setAnyInvalids,
}: {
	unitKey: keyof MultiUnitUris;
	uris: AtUri[];
	setUris: (uris: AtUri[]) => void;
	setAnyInvalids: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}) {
	const [values, setValues] = useState(uris.map((u) => u.toString()));
	const [invalids, setInvalids] = useState(uris.map(() => false));
	const setInvalid = (index: number, invalid: boolean) => {
		setInvalids((prev) => {
			const newInvalid = prev.slice();
			newInvalid[index] = invalid;
			return newInvalid;
		});
		setAnyInvalids((prev) => ({ ...prev, [`${unitKey}#${index.toString()}`]: true }));
	};
	const onBlur = (i: number) => () => {
		setUris(
			values.map((v) => {
				try {
					const atUri = new AtUri(v);
					setInvalid(i, false);
					return atUri;
				} catch (error) {
					console.error("Invalid URI:", error);
					setInvalid(i, true);
					return new AtUri("at://did:web:invalid.invalid");
				}
			}),
		);
	};
	return (
		<div>
			{unitKey}:{" "}
			{values.map((v, i) => (
				<div key={i}>
					<input
						value={v}
						onChange={(e) => {
							const newValues = values.slice();
							newValues[i] = e.target.value;
							setValues(newValues);
						}}
						onBlur={onBlur(i)}
					/>
					{invalids[i] && <span style={{ color: "red" }}> Invalid URI</span>}
				</div>
			))}
		</div>
	);
});

function updateDialog() {}
