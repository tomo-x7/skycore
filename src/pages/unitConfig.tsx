import { AtUri } from "@atproto/api";
import { memo, useEffect, useMemo, useState } from "react";
import { MULTI_UNIT_KEYS, SINGLE_UNIT_KEYS } from "../../units/config";
import type { Loader, MultiUnitUris, SingleUnitUris, UnitUris } from "../loader/types";
import "./unitConfig.css";
import { IoIosAdd, IoIosClose, IoIosCloseCircle } from "react-icons/io";
import { useMediaQueries } from "../lib/hooks/device";
import toast, { Toaster, ToastPosition } from "react-hot-toast";
import equal from "deep-equal";

const setSingleUri =
	(setUnitUris: React.Dispatch<React.SetStateAction<UnitUris>>, key: keyof SingleUnitUris) => (uri: AtUri) => {
		setUnitUris((prev) => ({
			...prev,
			[key]: uri,
		}));
	};
const setMultiUri =
	(setUnitUris: React.Dispatch<React.SetStateAction<UnitUris>>, key: keyof MultiUnitUris) =>
	(uris: AtUri[] | ((prev: AtUri[]) => AtUri[])) =>
		setUnitUris((prev) => ({
			...prev,
			[key]: typeof uris === "function" ? uris(prev[key]) : uris,
		}));

export function UnitConfig({ loader }: { loader: Loader }) {
	const [unitUris, setUnitUris] = useState<UnitUris>(loader.unitUris);
	const [anyInvalids, setAnyInvalids] = useState<{ [key: string]: boolean }>({});
	const allValid = Object.values(anyInvalids).every((v) => v === false);
	const { isMobile } = useMediaQueries();
	const [testing, setTesting] = useState(false);

	const haveChange = useMemo(
		() => testing || !equal(unitUris, loader.unitUris),
		[unitUris, loader.unitUris, testing],
	);
	console.log(haveChange ? "haveChange" : "noChange");
	useEffect(() => {
		const listener = (ev: BeforeUnloadEvent) => {
			ev.preventDefault();
			ev.returnValue = "未保存の変更があります";
			return "未保存の変更があります";
		};
		if (haveChange) {
			window.addEventListener("beforeunload", listener);
		}
		return () => window.removeEventListener("beforeunload", listener);
	}, [haveChange]);

	const save = async () => {
		try {
			setTesting(true);
			const promise = loader.testUnit(unitUris, console.log).then((b) => {
				if (!b) throw new Error("Test failed");
			});
			toast.promise(promise, {
				loading: "Testing...",
				success: "Test passed",
				error: "Test failed",
			});
			const success = await promise.then(() => true).catch(() => false);
			if (success) {
				const saveSuccess = loader.updateUnit(unitUris);
				if (saveSuccess) toast.success("保存しました");
				else toast.error("保存に失敗しました");
			}
		} finally {
			setTesting(false);
		}
	};
	return (
		<div id="unitConfig">
			{SINGLE_UNIT_KEYS.map((key) => (
				<SingleUnitConfig
					key={key}
					unitKey={key}
					uri={unitUris[key]}
					setUri={setSingleUri(setUnitUris, key)}
					setAnyInvalids={setAnyInvalids}
					lock={testing}
				/>
			))}
			{MULTI_UNIT_KEYS.map((key) => (
				<MultiUnitConfig
					key={key}
					unitKey={key}
					uris={unitUris[key]}
					setUris={setMultiUri(setUnitUris, key)}
					setAnyInvalids={setAnyInvalids}
					lock={testing}
				/>
			))}
			{!allValid && <div style={{ color: "red" }}>Some URIs are invalid</div>}
			<div className="buttons">
				<a href="/">←戻る</a>
				<button id="save" type="button" onClick={() => save()} disabled={testing || !allValid}>
					保存
				</button>
			</div>
			<Toaster position={(isMobile ? "bottom-center" : "bottom-left") satisfies ToastPosition} />
		</div>
	);
}

const SingleUnitConfig = memo(function SingleUnitConfig({
	uri,
	setUri,
	unitKey,
	setAnyInvalids,
	lock,
}: {
	unitKey: keyof SingleUnitUris;
	uri: AtUri;
	setUri: (uri: AtUri) => void;
	setAnyInvalids: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
	lock: boolean;
}) {
	const [value, setValue] = useState(uri.toString());
	const [invalid, setInvalid] = useState(false);
	const onBlur = () => {
		try {
			setUri(new AtUri(value));
			setInvalid(false);
			setAnyInvalids((prev) => ({ ...prev, [unitKey]: false }));
		} catch (error) {
			setInvalid(true);
			setAnyInvalids((prev) => ({ ...prev, [unitKey]: true }));
		}
	};
	return (
		<div className="single-config">
			<div className="key">{unitKey}</div>
			<input
				disabled={lock}
				className="value"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={onBlur}
			/>
			{invalid && (
				<span className="invalid" style={{ color: "red" }}>
					{" "}
					Invalid
				</span>
			)}
		</div>
	);
});
const MultiUnitConfig = memo(function MultiUnitConfig({
	unitKey,
	uris,
	setUris,
	setAnyInvalids,
	lock,
}: {
	unitKey: keyof MultiUnitUris;
	uris: AtUri[];
	setUris: React.Dispatch<React.SetStateAction<AtUri[]>>;
	setAnyInvalids: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
	lock: boolean;
}) {
	const [data, setData] = useState(uris.map((u) => ({ uri: u.toString(), invalid: false })));
	const setInvalid = (index: number, invalid: boolean) => {
		setData((prev) => {
			const newData = prev.slice();
			newData[index].invalid = invalid;
			return newData;
		});
	};
	useEffect(() => {
		setAnyInvalids((prev) => ({ ...prev, [unitKey]: data.some((v) => v.invalid) }));
	}, [data, setAnyInvalids, unitKey]);
	const onBlur = () => {
		setUris(
			data.map((v, i) => {
				try {
					const atUri = new AtUri(v.uri);
					setInvalid(i, false);
					return atUri;
				} catch (error) {
					setInvalid(i, true);
					return new AtUri("at://did:web:invalid.invalid");
				}
			}),
		);
	};
	const remove = (i: number) => () => {
		setData((prev) => prev.filter((_, idx) => idx !== i));
		setUris((prev) => prev.filter((_, idx) => idx !== i));
	};
	const push = () => void setData((prev) => [...prev, { uri: "", invalid: true }]);
	return (
		<div className="multi-config">
			<div className="key">{unitKey}</div>
			<div className="values">
				{data.map(({ uri, invalid }, i) => (
					<div className="value" key={i}>
						{invalid && (
							<span className="invalid" style={{ color: "red" }}>
								<IoIosCloseCircle size={"1.1em"} />
							</span>
						)}
						<input
							value={uri}
							onChange={(e) => {
								const newValues = data.slice();
								newValues[i].uri = e.target.value;
								setData(newValues);
							}}
							onBlur={onBlur}
							disabled={lock}
						/>
						<button type="button" onClick={remove(i)} className="remove-btn" disabled={lock}>
							<IoIosClose />
						</button>
					</div>
				))}
			</div>
			<button className="add" type="button" onClick={push} style={{ marginTop: 8 }} disabled={lock}>
				<IoIosAdd />
				追加
			</button>
		</div>
	);
});
