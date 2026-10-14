<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import WordReveal from '$lib/components/WordReveal.svelte';

	gsap.registerPlugin(ScrollTrigger);

	let root: HTMLElement;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.set('.info-copy', { opacity: 0, y: 40 });

			gsap.to('.info-copy', {
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power3.out',
				stagger: 0.15,
				scrollTrigger: { trigger: root, start: 'top 40%', once: true }
			});
		}, root);

		return () => ctx.revert();
	});
</script>

<section
	bind:this={root}
	class="min-h-screen w-screen overflow-hidden bg-black px-16 py-32 text-white"
>
	<WordReveal
		lines={['our solutions are used in more', 'than 50 countries worldwide']}
		textClass="font-antonio uppercase leading-[0.9] text-[clamp(3rem,7vw,7rem)]"
		size="1.2em"
	/>

	<div class="mt-16 md:mt-24 md:pl-[51%]">
		<p class="info-copy max-w-md font-sans text-sm leading-snug text-neutral-300">
			ARQO is an architectural systems company specializing in high-performance building envelope
			solutions. Our core business encompasses the design and manufacture of façade, glazing,
			roofing, and solar-shading systems for a wide range of architectural applications. Through
			engineering precision, material research, and refined design, ARQO develops systems that
			balance performance, durability, and architectural expression.
		</p>

		<a
			href="/contact"
			class="info-copy mt-8 inline-block border-b border-white pb-0.5 font-sans text-xs tracking-wide uppercase"
		>
			More about us
		</a>
	</div>
</section>
