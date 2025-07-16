import { useMatch } from "react-router-dom";

interface UseMatchesResult {
	isHome: boolean;
	isSearch: boolean;
	isMessages: boolean;
	isNotifications: boolean;
	isFeeds: boolean;
	isLists: boolean;
	isSelfProfile: boolean;
	isSettings: boolean;
}

export function useMatches(): UseMatchesResult {
	const isHome = useMatch("/") != null;
	const isSearch = useMatch("/search") != null;
	const isMessages = useMatch("/messages") != null;
	const isNotifications = useMatch("/notifications") != null;
	const isFeeds = useMatch("/feeds") != null;
	const isLists = useMatch("/lists") != null;
	const isSelfProfile = useMatch("/profile/:did")?.params.did === fetcher.did;
	const isSettings = useMatch("/settings") != null;
	const matches: UseMatchesResult = {
		isFeeds,
		isHome,
		isLists,
		isMessages,
		isNotifications,
		isSearch,
		isSelfProfile,
		isSettings,
	};
	return matches;
}
