<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import navbarItems from '$lib/constants/navbarItems';
	import { Search, GlobeAlt } from '@boxicons/svelte';

	let root: HTMLElement;
	let q: ReturnType<typeof gsap.utils.selector>;
	let ctx: gsap.Context;

	onMount(() => {
		q = gsap.utils.selector(root);

		ctx = gsap.context(() => {
			gsap.set(root, { scaleX: 0, autoAlpha: 1 });
			gsap.set(q('.navbar-logo, .navbar-item-text, .navbar-icon'), {
				yPercent: 120,
				opacity: 0
			});
		}, root);

		return () => ctx.revert();
	});

	export function reveal(duration = 2.2) {
		const tl = gsap.timeline();

		tl.to(root, { scaleX: 1, duration, ease: 'power4.inOut' }, 0);

		tl.to(
			q('.navbar-item-text'),
			{
				yPercent: 0,
				opacity: 1,
				duration: 1,
				ease: 'power4.out',
				stagger: { each: 0.12, from: 'center' }
			},
			duration * 0.7
		);

		tl.to(
			q('.navbar-logo, .navbar-icon'),
			{
				yPercent: 0,
				opacity: 1,
				duration: 1,
				ease: 'power4.out',
				stagger: 0.08
			},
			duration * 0.8
		);

		return tl;
	}
</script>

<div class="pointer-events-none fixed inset-x-0 top-4 z-[9998] flex justify-center md:top-6">
	<nav
		bind:this={root}
		class="navbar pointer-events-auto invisible flex h-13 w-[95%] origin-center items-center justify-between rounded-lg bg-white p-3 font-antonio"
	>
		<a href="/" class="navbar-logo -mt-2 flex cursor-pointer flex-col font-singo-sans text-black">
			<div class="top-part leading-none">
				<span class="text-xl">A</span>
				<span class="text-xl">R</span>
			</div>
			<div class="bottom-part -my-2.5 leading-none">
				<span class="text-xl">Q</span>
				<span class="text-xl">O</span>
			</div>
		</a>

		<div class="navbar-items w-[70%]">
			<ul class="flex w-full items-center justify-between">
				{#each navbarItems as item (item)}
					<a href={item.href} class="navbar-item cursor-pointer overflow-hidden text-xl tracking-wider">
						<span class="navbar-item-text inline-block uppercase">{item.label}</span>
					</a>
				{/each}
			</ul>
		</div>

		<div class="navbar-icons flex cursor-pointer items-center gap-3">
			<div class="navbar-icon overflow-hidden"><Search /></div>
			<div class="navbar-icon overflow-hidden"><GlobeAlt /></div>
		</div>
	</nav>
</div>
