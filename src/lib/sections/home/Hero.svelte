<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import TextReveal from '$lib/components/TextReveal.svelte';
	import { getSite } from '$lib/siteContext';

	let root: HTMLDivElement;
	let engineered: ReturnType<typeof TextReveal>;
	let envelope: ReturnType<typeof TextReveal>;
	let solutions: ReturnType<typeof TextReveal>;

	const site = getSite();
	site.claimNavbar();

	onMount(() => {
		let cancelled = false;

		const ctx = gsap.context(() => {
			gsap.set('.first-circle, .second-circle', { y: -500, opacity: 0 });
			gsap.set('.hero-image', { scale: 2 });
			gsap.set('.quote', { y: 200, opacity: 0 });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				const titles = [engineered, envelope, solutions];
				titles.forEach((t) => t.prepare());

				const master = gsap.timeline({ delay: 0.3 });

				master.addLabel('build', '+=0.4');

				master.add(site.navbarReveal(), 'build');

				titles.forEach((t) => master.add(t.reveal(2.2), 'build'));

				master.addLabel('swap', '+=0.2');
				titles.forEach((t) => master.add(t.swap(1.2), 'swap'));

				master.addLabel('finale', '+=0.1');

				master.to(
					'.first-circle',
					{ y: 80, opacity: 1, duration: 2, ease: 'power2.inOut' },
					'finale'
				);
				master.to(
					'.second-circle',
					{ y: 150, opacity: 1, duration: 2, ease: 'power2.inOut' },
					'finale'
				);
				master.to('.third-circle', { y: 280, duration: 2, ease: 'power2.inOut' }, 'finale');

				master.to(
					'.hero-image',
					{
						scale: 1,
						duration: 2,
						ease: 'power2.inOut'
					},
					'finale'
				);

				master.add(envelope.stretch(1.4), 'finale+=0.8');
				master.add(solutions.stretch(1.4), 'finale+=0.8');

				master.to('.quote', { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' }, 'finale+=0.3');
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});
</script>

<div bind:this={root} class="h-screen w-screen bg-black p-4 font-singo-sans md:p-6">
	<div class="relative flex h-full w-full justify-center">
		<div
			class="first-circle pointer-events-none absolute -top-40 left-[30%] z-60 h-72 w-72 overflow-hidden rounded-full will-change-transform"
		>
			<img
				src="/low-angle-roof.jpg"
				alt="Low angle roof"
				class="hero-image h-full w-full object-cover"
			/>
		</div>

		<div
			class="second-circle pointer-events-none absolute top-[5%] left-[56%] z-60 h-72 w-72 overflow-hidden rounded-full will-change-transform"
		>
			<img
				src="/shading2.jpg"
				alt="Shading on building exteriors"
				class="hero-image h-full w-full object-cover"
			/>
		</div>

		<div
			class="third-circle final-dot pointer-events-none absolute top-1/2 left-1/2 z-60 h-72 w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-500 will-change-transform"
		>
			<img
				src="/modern-glass-building.jpg"
				alt="Modern glass building exterior"
				class="hero-image h-full w-full object-cover"
			/>
		</div>

		<div
			class="hero-title font-antonio absolute top-[47%] left-1/2 z-[70] flex w-[100%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 text-white"
		>
			<TextReveal
				bind:this={engineered}
				text="Engineered"
				textClass="text-[23rem] leading-[1.03]"
				heightClass="h-96"
			/>
			<div class="flex w-full justify-between">
				<TextReveal
					bind:this={envelope}
					text="Envelope"
					textClass="text-[12rem] tracking-normal leading-[1.04]"
					heightClass="h-52"
					postReveal="stretch-o"
				/>
				<TextReveal
					bind:this={solutions}
					text="Solutions"
					textClass="text-[12.5rem] tracking-normal leading-[1.04]"
					heightClass="h-52"
					postReveal="stretch-o"
				/>
			</div>
		</div>

		<div
			class="quote text-md absolute bottom-0 left-[12%] w-52 text-right font-sans leading-none text-white"
		>
			“ARQO creates highly efficient, sustainable and refined systems for the architecture of
			tomorrow.”
		</div>

		<div
			class="quote text-md absolute right-[21%] bottom-0 w-52 text-right font-sans leading-none text-white"
		>
			“We believe in high performance, precision, safety and tailor-made systems for every
			architectural environment.”
		</div>
	</div>
</div>
