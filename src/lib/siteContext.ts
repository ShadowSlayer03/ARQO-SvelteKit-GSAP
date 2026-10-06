import { getContext, setContext } from 'svelte';

type SiteContext = {
	navbarReveal: () => gsap.core.Timeline;
	claimNavbar: () => void;
};

const KEY = Symbol('site');

export const setSite = (ctx: SiteContext) => setContext(KEY, ctx);
export const getSite = () => getContext<SiteContext>(KEY);
