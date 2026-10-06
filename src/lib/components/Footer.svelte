<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import footerItems, { heading } from '$lib/constants/footerItems';
	import WordReveal from './WordReveal.svelte';

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	let root: HTMLElement;

	/*
	onMount(() => {
		let cancelled = false;

		const ctx = gsap.context(() => {
			const q = gsap.utils.selector(root);
			gsap.set(q('.ft-word'), { yPercent: (i) => (i % 2 === 0 ? 50 : -100) });
			gsap.set(q('.ft-fade'), { opacity: 0, y: 20 });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				const q = gsap.utils.selector(root);
				const words = q('.ft-word');

				const wordsTl = gsap.timeline();
				wordsTl
					.to(words, {
						yPercent: (i) => (i % 2 === 0 ? 0 : -50),
						duration: 1.4,
						ease: 'power4.out',
						stagger: 0.12
					})
					.to(
						words,
						{
							yPercent: (i) => (i % 2 === 0 ? -50 : 0),
							duration: 1.4,
							ease: 'power4.out',
							stagger: 0.12
						},
						'+=0.5'
					);

				gsap
					.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } })
					.to(q('.ft-line'), { attr: { x2: 100 }, duration: 1.4, ease: 'power3.inOut' })
					.add(wordsTl, 0.2)
					.to(q('.ft-fade'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.8);

				ScrollTrigger.refresh();
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});
	*/

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.set('.ft-fade', { opacity: 0, y: 20 });

			gsap
				.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } })
				.to('.ft-line', { attr: { x2: 100 }, duration: 1.4, ease: 'power3.inOut' })
				.to('.ft-fade', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.8);
		}, root);

		// fonts change the layout, so re-measure trigger positions once they load
		document.fonts.ready.then(() => ScrollTrigger.refresh());

		return () => ctx.revert();
	});

	function roll(e: Event, on: boolean) {
		const col = (e.currentTarget as HTMLElement).querySelector('.ft-roll');
		gsap.to(col, { yPercent: on ? -50 : 0, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
	}

	function toTop() {
		const smoother = ScrollSmoother.get();
		if (smoother) smoother.scrollTo(0, true);
		else window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<footer
	bind:this={root}
	class="relative w-screen bg-black px-5 pb-6 font-antonio text-white md:px-10"
>
	<svg class="block h-[2px] w-full" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
		<line
			class="ft-line"
			x1="0" y1="1" x2="0" y2="1"
			stroke="white"
			stroke-width="2"
			vector-effect="non-scaling-stroke"
		/>
	</svg>

	<!-- <h2
		class="flex flex-wrap gap-x-[0.22em] pt-10 text-[clamp(3rem,10vw,10rem)] uppercase leading-none"
		aria-label={heading.join(' ')}
	>
		{#each heading as word, id(word + id.toString())}
			<div class="h-[1.2em] overflow-hidden" aria-hidden="true">
				<div class="ft-word flex flex-col will-change-transform">
					<span class="block h-[1.2em] leading-[1.2em]">{word}</span>
					<span class="block h-[1.2em] leading-[1.2em]">{word}</span>
				</div>
			</div>
		{/each}
	</h2> -->

	<div class="pt-10" role="heading" aria-level="2" aria-label={heading.join(' ')}>
		<WordReveal
			lines={[heading.join(' ')]}
			textClass="font-antonio text-[clamp(3rem,10vw,10rem)] uppercase leading-none"
			stagger={0.12}
			size="1.2em"
		/>
	</div>

	<div class="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
		<p class="ft-fade col-span-2 max-w-64 font-sans text-base leading-tight text-white/70 md:col-span-1">
			ARQO creates highly efficient, sustainable and refined systems for the architecture of
			tomorrow.
		</p>

		{#each footerItems as col (col.title)}
			<div class="ft-fade">
				<h6 class="mb-4 font-sans text-xs uppercase tracking-widest text-white/50">{col.title}</h6>

				<ul class="flex flex-col gap-1">
					{#each col.links as link (link.label)}
						<li>
							<a
								href={link.href}
								class="block h-[1.2em] overflow-hidden text-2xl uppercase"
								onmouseenter={(e) => roll(e, true)}
								onmouseleave={(e) => roll(e, false)}
							>
								<span class="ft-roll flex flex-col">
									<span class="block h-[1.2em] leading-[1.2em]">{link.label}</span>
									<span class="block h-[1.2em] leading-[1.2em]" aria-hidden="true">{link.label}</span>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="ft-fade mt-24 flex items-center justify-between font-sans text-xs uppercase tracking-wide">
		<span>© {new Date().getFullYear()} ARQO. All rights reserved.</span>
		<button type="button" class="cursor-pointer uppercase underline-offset-4 hover:underline" onclick={toTop}>
			Back to top ↑
		</button>
	</div>
</footer>
