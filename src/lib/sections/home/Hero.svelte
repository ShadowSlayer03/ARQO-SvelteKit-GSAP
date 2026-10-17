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
		const isCompact = window.matchMedia('(max-width: 1023px)').matches;

		const ctx = gsap.context(() => {
			gsap.set('.first-circle, .second-circle', {
				y: isCompact ? -220 : -500,
				opacity: 0
			});
			gsap.set('.hero-image', { scale: 2 });
			gsap.set('.quote', { y: 200, opacity: 0 });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				const titles = [engineered, envelope, solutions];
				engineered.prepare();
				if (!isCompact) {
					envelope.prepare();
					solutions.prepare();
				}

				const master = gsap.timeline({ delay: 0.3 });

				master.addLabel('build', '+=0.4');

				master.add(site.navbarReveal(), 'build');

				titles.forEach((t) => master.add(t.reveal(2.2), 'build'));

				master.addLabel('swap', '+=0.2');
				titles.forEach((t) => master.add(t.swap(1.2), 'swap'));

				master.addLabel('finale', '+=0.1');

				master.to(
					'.first-circle',
					{ y: isCompact ? 28 : 80, opacity: 1, duration: 2, ease: 'power2.inOut' },
					'finale'
				);
				master.to(
					'.second-circle',
					{ y: isCompact ? 45 : 150, opacity: 1, duration: 2, ease: 'power2.inOut' },
					'finale'
				);
				master.to(
					'.third-circle',
					{ y: isCompact ? 100 : 280, duration: 2, ease: 'power2.inOut' },
					'finale'
				);

				master.to(
					'.hero-image',
					{
						scale: 1,
						duration: 2,
						ease: 'power2.inOut'
					},
					'finale'
				);

				if (!isCompact) {
					master.add(envelope.stretch(1.4), 'finale+=0.8');
					master.add(solutions.stretch(1.4), 'finale+=0.8');
				}

				master.to('.quote', { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' }, 'finale+=0.3');
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});
</script>

<div
	bind:this={root}
	class="h-screen w-screen bg-black p-4 font-singo-sans max-lg:h-[100svh] max-lg:overflow-hidden md:p-6"
>
	<div class="relative flex h-full w-full justify-center">
		<div
			class="first-circle pointer-events-none absolute -top-40 left-[30%] z-60 h-72 w-72 overflow-hidden rounded-full will-change-transform max-lg:-top-12 max-lg:left-[20%] max-lg:h-[clamp(5rem,27vw,18rem)] max-lg:w-[clamp(5rem,27vw,18rem)]"
		>
			<img
				src="/low-angle-roof.jpg"
				alt="Low angle roof"
				class="hero-image h-full w-full object-cover"
			/>
		</div>

		<div
			class="second-circle pointer-events-none absolute top-[5%] left-[56%] z-60 h-72 w-72 overflow-hidden rounded-full will-change-transform max-lg:h-[clamp(5rem,27vw,18rem)] max-lg:w-[clamp(5rem,27vw,18rem)]"
		>
			<img
				src="/shading2.jpg"
				alt="Shading on building exteriors"
				class="hero-image h-full w-full object-cover"
			/>
		</div>

		<div
			class="third-circle final-dot pointer-events-none absolute top-1/2 left-1/2 z-60 h-72 w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-500 will-change-transform max-lg:h-[clamp(5rem,27vw,18rem)] max-lg:w-[clamp(5rem,27vw,18rem)]"
		>
			<img
				src="/modern-glass-building.jpg"
				alt="Modern glass building exterior"
				class="hero-image h-full w-full object-cover"
			/>
		</div>

		<div
			class="hero-title absolute top-[47%] left-1/2 z-[70] flex w-[100%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 font-antonio text-white max-lg:top-[45%] max-lg:gap-2"
		>
			<TextReveal
				bind:this={engineered}
				text="Engineered"
				textClass="text-[23rem] leading-[1.03] max-lg:text-[clamp(3.25rem,17vw,9rem)]"
				heightClass="h-96 max-lg:h-[clamp(3.5rem,17.5vw,9.5rem)]"
			/>
			<div class="flex w-full justify-between max-lg:flex-col max-lg:items-center max-lg:gap-1">
				<TextReveal
					bind:this={envelope}
					text="Envelope"
					textClass="text-[12rem] tracking-normal leading-[1.04] max-lg:text-[clamp(2.25rem,14vw,6.5rem)]"
					heightClass="h-52 max-lg:h-[clamp(2.7rem,14.8vw,6.75rem)]"
					postReveal="stretch-o"
				/>
				<TextReveal
					bind:this={solutions}
					text="Solutions"
					textClass="text-[12.5rem] tracking-normal leading-[1.04] max-lg:text-[clamp(2.25rem,14vw,6.5rem)]"
					heightClass="h-52 max-lg:h-[clamp(2.7rem,14.8vw,6.75rem)]"
					postReveal="stretch-o"
				/>
			</div>
		</div>

		<div
			class="quote text-md absolute bottom-0 left-[10%] w-52 text-right font-sans leading-none text-white max-lg:right-5 max-lg:bottom-24 max-lg:left-5 max-lg:w-auto max-lg:text-center max-lg:text-xs max-lg:leading-tight"
		>
			“ARQO creates highly efficient, sustainable and refined systems for the architecture of
			tomorrow.”
		</div>

		<div
			class="quote text-md absolute right-[20%] bottom-0 w-52 text-right font-sans leading-none text-white max-lg:right-5 max-lg:bottom-4 max-lg:left-5 max-lg:w-auto max-lg:text-center max-lg:text-xs max-lg:leading-tight"
		>
			“We believe in high performance, precision, safety and tailor-made systems for every
			architectural environment.”
		</div>
	</div>
</div>
