<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	type PostRevealEffect = 'stretch-o' | 'none';

	let {
		text,
		textClass = '',
		heightClass = '',
		postReveal = 'none' as PostRevealEffect,
		oTop = 0.06,
		oHeight = 0.4,
		oStroke = 0.11,
		oExtra = 1.1
	} = $props();

	let root: HTMLDivElement;
	const textArr = text.split('');

	// scoped selector: only finds elements inside THIS component
	let q: ReturnType<typeof gsap.utils.selector>;
	let ctx: gsap.Context;
	let pills: { pill: HTMLElement; col: HTMLElement; endHeight: number }[] = [];

	onMount(() => {
		q = gsap.utils.selector(root);

		// initial hidden positions (runs before the parent's onMount)
		ctx = gsap.context(() => {
			gsap.set(q('.move-up-one, .move-up-two'), { y: '100%' });
			gsap.set(q('.move-down-one, .move-down-two'), { y: '-200%' });
		}, root);

		return () => {
			ctx.revert();
			pills.forEach(({ pill }) => pill.remove());
			pills = [];
		};
	});

	/** Measure the O's and create invisible pills. Call once fonts are loaded. */
	export function prepare() {
		if (postReveal !== 'stretch-o') return;

		const rootRect = root.getBoundingClientRect();

		root.querySelectorAll<HTMLElement>('.o-col').forEach((col) => {
			const r = col.getBoundingClientRect();
			const fs = parseFloat(getComputedStyle(col.querySelector('span')!).fontSize);
			const baseH = oHeight * fs;

			const pill = document.createElement('div');
			Object.assign(pill.style, {
				position: 'absolute',
				left: `${r.left - rootRect.left}px`,
				top: `${r.top - rootRect.top + oTop * fs}px`,
				width: `${r.width}px`,
				height: `${baseH}px`,
				border: `${oStroke * fs}px solid currentColor`,
				borderRadius: '9999px',
				boxSizing: 'border-box',
				pointerEvents: 'none',
				opacity: '0'
			});
			root.appendChild(pill);
			pills.push({ pill, col, endHeight: baseH + oExtra * fs });
		});
	}

	/** Phase 1: letters slide into the window */
	export function reveal(duration = 2) {
		const tl = gsap.timeline({ defaults: { duration, ease: 'power4.inOut' } });
		tl.to(q('.move-up-one, .move-up-two'), { y: 0 }, 0).to(
			q('.move-down-one, .move-down-two'),
			{ y: '-100%' },
			0
		);
		return tl;
	}

	/** Phase 2: letters swap places (completes the shuffle) */
	export function swap(duration = 1.2) {
		const tl = gsap.timeline({ defaults: { duration, ease: 'power4.inOut' } });
		tl.to(q('.move-up-one, .move-up-two'), { y: '-100%' }, 0).to(
			q('.move-down-one, .move-down-two'),
			{ y: 0 },
			0
		);
		return tl;
	}

	/** Phase 3: swap the real O for the pill and stretch it downward */
	export function stretch(duration = 1.4) {
		const tl = gsap.timeline();
		pills.forEach(({ pill, col, endHeight }) => {
			tl.set(col.querySelectorAll('span'), { opacity: 0 }, 0)
				.set(pill, { opacity: 1 }, 0)
				.to(pill, { height: endHeight, duration, ease: 'power3.out' }, 0);
		});
		return tl;
	}
</script>

<div bind:this={root} class="logo-container relative text-white">
	<div class={`${heightClass} flex items-start overflow-hidden`}>
		{#each textArr as letter, i (letter + i)}
			<div
				class={`flex flex-col leading-[0.8] ${
					postReveal === 'stretch-o' && letter.toLowerCase() === 'o' ? 'o-col' : ''
				}`}
			>
				<span
					class={`${i % 2 === 0 ? 'move-up-one' : 'move-down-one'} ${textClass} block uppercase`}
				>
					{letter}
				</span>
				<span
					class={`${i % 2 === 0 ? 'move-up-two' : 'move-down-two'} ${textClass} block uppercase`}
				>
					{letter}
				</span>
			</div>
		{/each}
	</div>
</div>
