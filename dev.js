//@ts-check
import { watch } from "chokidar"; // フォルダ監視用
import { exec, execSync } from "node:child_process";
import { exit } from "node:process";

// Initialize watcher.
const watcher = watch(["./src", "./units", "./index.html"], {
	persistent: true,
	usePolling: true,
	interval: 100,
});

let pid;
const startServer = () => {
	console.log("start server");
	pid = exec("pnpm run preview").pid;
	console.log(`http-server process : ${pid}`);
};
const stopServer = () => {
	if (pid) {
		console.log(`stop server : ${pid}`);
		try {
			process.kill(pid);
			pid = undefined;
		} catch {}
	} else {
		console.log("server not running");
	}
};
const build = () => {
	try {
		const hrstart = process.hrtime();
		execSync(
			'(echo "esbuild\n" &&NODE_ENV="development" node ./esbuild.js && echo "\nvite\n" && ./node_modules/.bin/vite build )> devbuild.log',
		);
		const hrend = process.hrtime(hrstart);
		console.log("build success : %dms", hrend[0] * 1000 + hrend[1] / 1000000);
	} catch (e) {
		console.error(e);
	}
};
build();
startServer();
watcher.on("change", (...param) => {
	console.log(`changed files : ${param[0]}`);
	build();
});

const cleanup = () => {
	stopServer();
	exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("SIGQUIT", cleanup);
