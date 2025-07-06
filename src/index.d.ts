/// <reference types="vite/client" />

declare global {
	var fetcher: import("./fetcher/index").Fetcher;
	var goTop: () => void;
}

export {};
