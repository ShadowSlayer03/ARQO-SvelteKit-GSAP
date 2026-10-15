<script lang="ts">
    import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';

	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LoaderZoom from '$lib/components/LoaderZoom.svelte';
	import LogoReveal from '$lib/components/LogoReveal.svelte';
	import MousePointer from '$lib/components/MousePointer.svelte';
	import { setSite } from '$lib/siteContext';

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	let { children } = $props();

	let animationState: 'init' | 'loaded' | 'completed' = $state('init');
	let navbar = $state<ReturnType<typeof Navbar>>();
	let smoother: ScrollSmoother | null = null;

	let showMousePointer = $state(true);

	let navbarClaimed = false;
	let navbarPlayed = false;
	const initialPath = page.url.pathname;

	const pathsWithoutFooter = ['/contact'];

	setSite({
			navbarReveal: () => {
				if (navbarPlayed) return gsap.timeline();

				navbarPlayed = true;
				return navbar!.reveal(2.2);
			},
			claimNavbar: () => {
				navbarClaimed = true;
			},
			showMousePointer,
			setShowMousePointer: (show) => {
				showMousePointer = show;
			}
		});

	$effect(() => {
		if (animationState !== 'completed' || !navbar || navbarClaimed || navbarPlayed) return;
		navbarPlayed = true;

		if (initialPath !== '/') {
			navbar.showImmediately();
			return;
		}

		document.fonts.ready.then(() => navbar?.reveal(2.2));
	});

	$effect(() => {
		if (animationState !== 'completed') return;

		let cancelled = false;

		(async () => {
			await tick();
			if (cancelled) return;

			const wrapper = document.querySelector('#smooth-wrapper');
			const content = document.querySelector('#smooth-content');
			if (!wrapper || !content) return;

			smoother?.kill();
			smoother = ScrollSmoother.create({
				wrapper,
				content,
				smooth: 1.2,
				effects: true,
				smoothTouch: 0.1
			});
		})();

		return () => {
			cancelled = true;
			smoother?.kill();
			smoother = null;
		};
	});

	afterNavigate(async () => {
		await tick();
		if (page.url.pathname !== '/') navbar?.showImmediately();
		smoother?.scrollTo(0, false);
		ScrollTrigger.refresh();
	});

	onMount(() => {
		history.scrollRestoration = 'manual';
	});
</script>

{#if animationState === 'init'}
	<LogoReveal bind:animationState />
{:else if animationState === 'loaded'}
	<LoaderZoom bind:animationState />
{:else}
    {#if showMousePointer}
        <MousePointer />
	{/if}

	<Navbar bind:this={navbar} />

	<div id="smooth-wrapper" class="fixed inset-0 overflow-hidden">
		<div id="smooth-content">
			{@render children()}
			{#if !pathsWithoutFooter.includes(page.url.pathname)}
			    <Footer />
			{/if}
		</div>
	</div>
{/if}
