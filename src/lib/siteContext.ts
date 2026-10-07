import { getContext, setContext } from 'svelte';

export type SiteContext = {
	navbarReveal: () => gsap.core.Timeline;
	claimNavbar: () => void;
	showMousePointer: boolean;
	setShowMousePointer: (show: boolean) => void;
};

const KEY = Symbol('site');

export const setSite = (ctx: SiteContext) => setContext(KEY, ctx);
export const getSite = () => getContext<SiteContext>(KEY);
