export function logSubscriptions(): {
	log: (message: string) => void;
	setListener: (listener: (message: string[]) => void) => void;
} {
	let listener: ((message: string[]) => void) | null = null;
	const logMessages: string[] = ["start loading"];
	return {
		log: (message: string) => {
			logMessages.push(message);
			listener?.(logMessages.slice());
		},
		setListener: (newListener: (message: string[]) => void) => {
			listener = newListener;
		},
	};
}

export function performanceLog(): () => number {
	const start = performance.now();
	return () => {
		const end = performance.now();
		return end - start;
	};
}
