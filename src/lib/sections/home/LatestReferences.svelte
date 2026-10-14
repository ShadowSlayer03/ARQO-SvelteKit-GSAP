<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import referenceItems from '$lib/constants/referenceItems';

	gsap.registerPlugin(ScrollTrigger);

	let root: HTMLDivElement;
	let grid: HTMLDivElement;

	const IDLE_DIM = 0.35;
	const OTHER_DIM = 0.85;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.set('.ref-card', { clipPath: 'inset(100% 0% 0% 0%)' });
			gsap.set('.ref-img', { scale: 1.4 });
			gsap.set('.ref-overlay', { opacity: IDLE_DIM });
			gsap.set('.ref-meta', { opacity: 0, y: 40 });
			gsap.set('.ref-desc', { height: 0 });
			gsap.set('.ref-desc-text', { yPercent: 100 });

			const tl = gsap.timeline({
				scrollTrigger: { trigger: grid, start: 'top 80%', once: true }
			});

			tl.to(
				'.ref-card',
				{
					clipPath: 'inset(0% 0% 0% 0%)',
					duration: 1.4,
					ease: 'power4.inOut',
					stagger: 0.15
				},
				0
			)
				.to('.ref-img', { scale: 1, duration: 3, ease: 'power3.out', stagger: 0.15 }, 0)
				.to('.ref-meta', { opacity: 1, y: 0, duration: 2, ease: 'power3.out', stagger: 0.15 }, 0.8);
		}, root);

		return () => ctx.revert();
	});

	const focusCard = (active: HTMLElement) => {
		const q = gsap.utils.selector(grid);
		const opts = { duration: 0.7, ease: 'power3.out', overwrite: 'auto' as const };

		q('.ref-card').forEach((card) => {
			const c = gsap.utils.selector(card as HTMLElement);
			const isActive = card === active;

			gsap.to(c('.ref-overlay'), { opacity: isActive ? 0 : OTHER_DIM, ...opts });
			gsap.to(c('.ref-title'), { color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', ...opts });
			gsap.to(c('.ref-img'), {
				scale: isActive ? 1.05 : 1,
				duration: 1.2,
				ease: 'power3.out',
				overwrite: 'auto'
			});

			gsap.to(c('.ref-desc'), { height: isActive ? 'auto' : 0, ...opts });
			gsap.to(c('.ref-desc-text'), {
				yPercent: isActive ? 0 : 100,
				duration: 0.8,
				ease: 'power3.out',
				overwrite: 'auto'
			});
		});
	};

	const resetCards = () => {
		const q = gsap.utils.selector(grid);
		const opts = { duration: 0.7, ease: 'power3.out', overwrite: 'auto' as const };

		gsap.to(q('.ref-overlay'), { opacity: IDLE_DIM, ...opts });
		gsap.to(q('.ref-title'), { color: 'rgba(255,255,255,0.4)', ...opts });
		gsap.to(q('.ref-img'), { scale: 1, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
		gsap.to(q('.ref-desc'), { height: 0, ...opts });
		gsap.to(q('.ref-desc-text'), {
			yPercent: 100,
			duration: 0.8,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	};
</script>

<div
	bind:this={root}
	class="min-h-screen w-screen bg-black px-5 pt-10 font-antonio text-white md:px-10 md:pt-30"
>
	<div class="flex justify-between">
		<h5 class="text-[1rem] uppercase">Latest References</h5>
		<span class="cursor-pointer text-[1rem] uppercase underline">View All</span>
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={grid}
		class="ref-images mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4"
		onmouseleave={resetCards}
	>
		{#each referenceItems as reference, id (id)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<article
				class="ref-card relative h-[75vh] cursor-pointer overflow-hidden"
				onmouseenter={(e) => focusCard(e.currentTarget)}
			>
				<img
					src={reference.image}
					alt={`${reference.title} — ${reference.type} project by ARQO`}
					class="ref-img absolute inset-0 h-full w-full object-cover will-change-transform"
				/>

				<div class="ref-overlay pointer-events-none absolute inset-0 bg-black"></div>

				<div class="ref-meta absolute inset-x-0 bottom-0 p-5">
					<div class="flex items-end justify-between">
						<span class="ref-title text-4xl text-white/40 uppercase">{reference.title}</span>
						<span class="text-2xl">↗</span>
					</div>

					<div class="ref-desc overflow-hidden">
						<p class="ref-desc-text max-w-xs pt-3 font-sans text-sm leading-tight text-white/90">
							{reference.description}
						</p>
					</div>
				</div>
			</article>
		{/each}
	</div>
</div>
