import { useMediaQuery } from "react-responsive";
export function useMediaQueries() {
	const isDesktop = useMediaQuery({ minWidth: 1201 });
	const isTablet = useMediaQuery({ maxWidth: 1200, minWidth: 701 });
	const isMobile = useMediaQuery({ maxWidth: 700 });
	const isTabletOrMobile = isMobile || isTablet;
	const isTabletOrDesktop = isDesktop || isTablet;

	return { isDesktop, isMobile, isTablet, isTabletOrDesktop, isTabletOrMobile };
}
