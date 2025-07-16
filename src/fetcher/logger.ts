interface Logger {
	error: (message: string) => void;
	warn: (message: string) => void;
	info: (message: string) => void;
}
export const logger: Logger = {
	error: (message: string) => {
		console.error(`[ERROR] ${message}`);
	},
	info: (message: string) => {
		console.log(`[INFO] ${message}`);
	},
	warn: (message: string) => {
		console.warn(`[WARN] ${message}`);
	},
};
