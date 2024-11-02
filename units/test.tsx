import dayjs from "dayjs";

import type Reactns from "react";
export default function TestUnit({ React }: { React: typeof Reactns }) {
	return <div>{dayjs().format("yyyy-mm-dd")}</div>;
}
