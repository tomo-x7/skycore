/// <reference types="vite/client" />

declare global {
	var fetcher: import("./fetcher/index").Fetcher;
}

export {};
