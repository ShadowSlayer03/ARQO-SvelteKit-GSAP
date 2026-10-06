<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import TopicCard from '$lib/components/TopicCard.svelte';
	import topicItems from '$lib/constants/topicItems';

	gsap.registerPlugin(ScrollTrigger);

	let root: HTMLDivElement;
	let cards: HTMLDivElement;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.set('.topic-item', {
				y: (i) => (i % 2 === 0 ? 300 : -300),
				opacity: 0,
				duration: 2,
				ease: 'power2.in',
			});

			gsap.to('.topic-item', {
				y: 0,
				opacity: 1,
				duration: 1.2,
				ease: 'power4.out',
				stagger: 0.3,
				scrollTrigger: { trigger: cards, start: 'top 75%', once: true }
			});
		}, root);

		return () => ctx.revert();
	});
</script>

<div
	bind:this={root}
	class="min-h-[90vh] w-screen bg-black px-5 pt-10 font-antonio text-white md:px-10 md:pt-30"
>
	<h5 class="uppercase">Highlighted Topics</h5>

	<div bind:this={cards} class="topic-cards mt-15 flex flex-wrap gap-12">
		{#each topicItems as item, id (id)}
			<div class="topic-item">
				<TopicCard topic={item} />
			</div>
		{/each}
	</div>
</div>
