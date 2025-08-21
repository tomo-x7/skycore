import { useCallback, useState } from "react";
import type { Loader, UnitUris } from "../loader/types";

export function UnitConfig({ loader }: { loader: Loader }) {
	loader.unitUris;
	return (
		<>
			{Object.keys(loader.unitUris).map((key) => (
				<OneUnitConfig key={key} loader={loader} unitKey={key as keyof UnitUris} />
			))}
		</>
	);
}

function OneUnitConfig({ loader, unitKey }: { loader: Loader; unitKey: keyof UnitUris }) {
	const [uri, setUri] = useState(loader.unitUris[unitKey]);
	const [open, setOpen] = useState(false);
	const [logText, setLogText] = useState("");
	const [updateStatus, setUpdateStatus] = useState<undefined | boolean>(undefined);
	const update = useCallback(() => {
		setLogText("update unit uri...");
		setUpdateStatus(undefined);
		setOpen(true);
		unitKey
		loader
			// .updateUnit(unitKey, loader.unitUris[unitKey], (message) => setLogText((prev) => `${prev}\n${message}`))
			// .then((ok) => {
			// 	setUpdateStatus(ok);
			// });
	}, [loader, unitKey]);
	return (
		<div>
			{unitKey}: {uri.toString()}
			{open && <div>{logText}</div>}
		</div>
	);
}
