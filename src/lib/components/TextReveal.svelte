<script lang="ts">
	import { flushSync, onMount } from 'svelte';
	import gsap from 'gsap';

	type PostRevealEffect = 'stretch-o' | 'none';

	let {
		text,
		textClass = '',
		heightClass = '',
		postReveal = 'none' as PostRevealEffect,
		oTop = 0.15,
		oHeight = 0.87,
		oStroke = 0.11,
		oExtra = 0.6
	} = $props();

	let root: HTMLDivElement;

	const textArr = text.split('');

	let q: ReturnType<typeof gsap.utils.selector>;
	let ctx: gsap.Context;
	let pills: { pill: HTMLElement; col: HTMLElement; endHeight: number }[] = [];

	onMount(() => {
		q = gsap.utils.selector(root);

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

	export function prepare() {
		flushSync();
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
				opacity: '0',
				padding: '10px'
			});
			root.appendChild(pill);
			pills.push({ pill, col, endHeight: baseH + oExtra * fs });
		});
	}

	export function reveal(duration = 2) {
		const tl = gsap.timeline({ defaults: { duration, ease: 'power4.inOut' } });
		tl
		.to(q('.move-up-one, .move-up-two'), { y: 0 }, 0 )
		.to(q('.move-down-one, .move-down-two'), { y: '-100%' }, 0 );

		return tl;
	}

	export function swap(duration = 1.2) {
		const tl = gsap.timeline({ defaults: { duration, ease: 'power4.inOut' } });

		tl
		.to(q('.move-up-one, .move-up-two'), { y: '-100%' }, 0 )
		.to(q('.move-down-one, .move-down-two'), { y: 0 }, 0 );

		return tl;
	}

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
	<div class={`${heightClass} flex overflow-hidden`}>
		{#each textArr as letter, i (letter + i)}
			<div
				class={`flex flex-col ${textClass} ${
					postReveal === 'stretch-o' && letter.toLowerCase() === 'o' ? 'o-col' : ''
				}`}
			>
    			<span class={`${i % 2 === 0 ? 'move-up-one' : 'move-down-one'} block uppercase`}>
    				{letter === ' ' ? '\u00A0' : letter}
    			</span>

    			<span class={`${i % 2 === 0 ? 'move-up-two' : 'move-down-two'} block uppercase`}>
    				{letter === ' ' ? '\u00A0' : letter}
    			</span>
			</div>
		{/each}
	</div>
</div>
