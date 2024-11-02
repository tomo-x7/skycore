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
			pid=undefined
		} catch {}
	} else {
		console.log("server not running");
	}
};

startServer();
watcher.on("change", async (...param) => {
	console.log(`changed files : ${param[0]}`);
	try {
		execSync("pnpm run build > devbuild.log");
		console.log("build success");
	} catch (e) {
		console.error(e);
	}
});

const cleanup = () => {
	stopServer();
	exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("SIGQUIT", cleanup);
