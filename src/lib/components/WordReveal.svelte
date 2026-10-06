<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	let {
		lines = [] as string[],
		textClass = '',
		size,
		triggerOnScroll = true,
		stagger = 0.06
	} = $props();

	let counter = 0;
	const wordLines = lines.map((line) => line.split(' ').map((word) => ({ word, idx: counter++ })));

	let root: HTMLDivElement;

	onMount(() => {
		const q = gsap.utils.selector(root);

		const ctx = gsap.context(() => {
			gsap.set(q('.move-up-one, .move-up-two'), { y: '100%' });
			gsap.set(q('.move-down-one, .move-down-two'), { y: '-200%' });

			const play = () => {

				const tl = gsap.timeline({
					defaults: { duration: 1.2, ease: 'power4.inOut' }
				});

				tl.to(q('.move-up-one'), { y: 0, stagger }, 0)
					.to(q('.move-up-two'), { y: 0, stagger }, 0)
					.to(q('.move-down-one'), { y: '-100%', stagger }, 0)
					.to(q('.move-down-two'), { y: '-100%', stagger }, 0);

				tl.add(() => {
					const tl2 = gsap.timeline({
						defaults: { duration: 1.2, ease: 'power4.inOut' },
						onComplete: () => {
						}
					});

					tl2
						.to(q('.move-up-one'), { y: '-100%', stagger }, 0)
						.to(q('.move-up-two'), { y: '-100%', stagger }, 0)
						.to(q('.move-down-one'), { y: 0, stagger }, 0)
						.to(q('.move-down-two'), { y: 0, stagger }, 0);
				}, '+=0.25');
			};

			if (triggerOnScroll) {
				ScrollTrigger.create({
					trigger: root,
					start: 'top 70%',
					once: true,
					onEnter: play
				});
			} else {
				play();
			}
		}, root);

		return () => ctx.revert();
	});
</script>

<div bind:this={root} class={`word-reveal ${textClass}`}>
	{#each wordLines as line, id (line + id.toString())}
		<div class="flex flex-wrap gap-x-[0.22em]">
			{#each line as { word, idx } (idx)}
			<div class="overflow-hidden" style:height={size}>
				<div class="flex flex-col">
					<span
						class={`${idx % 2 === 0 ? 'move-up-one' : 'move-down-one'} block`}
						style:height={size}
						style:line-height={size}>{word}</span
					>
					<span
						class={`${idx % 2 === 0 ? 'move-up-two' : 'move-down-two'} block`}
						style:height={size}
						style:line-height={size}
						aria-hidden="true">{word}</span
					>
				</div>
			</div>
			{/each}
		</div>
	{/each}
</div>
