import { useEffect, useState } from "react";
import type { unit1 } from "./unittype";
import React from "react";

export function App() {
	const [unit1src, setunit1src] = useState<string>();
	const [unit1, setunit1] = useState<React.ReactElement>();
	useEffect(() => {
		(import(unit1src ?? "/units/test.js") as Promise<unit1>).then((unit1) => {
			setunit1(unit1({ React }));
		});
	}, [unit1src]);
	return <>{unit1}</>;
}
