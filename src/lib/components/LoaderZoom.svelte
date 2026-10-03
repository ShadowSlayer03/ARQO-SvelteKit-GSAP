<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let { animationState = $bindable() } = $props();

	let root: HTMLDivElement;

	const words = ['Architecture.', 'Research.', 'Quality.', 'Originality.'];
	const DOT_WORD_INDEX = 3;

	onMount(() => {
		const ctx = gsap.context(() => {
			// ------------------------------------------------------------
			// INITIAL STATE
			// ------------------------------------------------------------

			gsap.set('.loader-logo', {
				scale: 1,
				autoAlpha: 1,
				transformOrigin: '50% 50%'
			});

			gsap.set('.tagline', {
				autoAlpha: 0,
				scale: 0.6,
				transformOrigin: '50% 50%'
			});

			// Set initial states for kinetic text animation
			gsap.set('.move-up-one, .move-up-two', { y: '100%' });
			gsap.set('.move-down-one, .move-down-two', { y: '-200%' });
			gsap.set('.tagline-rest', {
				x: -20,
				autoAlpha: 0,
				clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
			});

			gsap.set('.white-circle, .black-circle', {
				scale: 0,
				autoAlpha: 1,
				transformOrigin: '50% 50%'
			});

			gsap.set('.final-dot', {
				scale: 0,
				autoAlpha: 1,
				transformOrigin: '50% 50%'
			});

			// ------------------------------------------------------------
			// MASTER TIMELINE
			// ------------------------------------------------------------

			const tl = gsap.timeline({
				onComplete: () => {
					animationState = 'completed';
				}
			});

			// ------------------------------------------------------------
			// 1. LOGO ZOOM
			// ------------------------------------------------------------

			tl.to(
				'.loader-logo',
				{
					z: 800,
					scale: 2,
					opacity: 0,
					duration: 3.3,
					ease: 'power4.in',
					transformOrigin: '50% 50%'
				},
				0
			);

			// ------------------------------------------------------------
			// 2. WHITE REVEAL
			// ------------------------------------------------------------
			tl.to(
				'.white-circle',
				{
					z: 300,
					scale: 50,
					opacity: 0,
					duration: 3.5,
					ease: 'power3.inOut'
				},
				2
			);

			// ------------------------------------------------------------
			// 3. BLACK REVEAL
			// ------------------------------------------------------------

			tl.to(
				'.black-circle',
				{
					z: 300,
					scale: 50,
					duration: 3,
					ease: 'power3.inOut'
				},
				2.5
			);

			// ------------------------------------------------------------
			// 4. TAGLINE (TEXT SLIDE ANIMATION)
			// ------------------------------------------------------------

			tl.to(
				'.tagline',
				{
					autoAlpha: 1,
					scale: 1,
					duration: 0.8,
					ease: 'power3.out'
				},
				3.2
			);

			// Kinetic Initials Slide
			tl.to(
				'.move-up-one, .move-up-two',
				{
					y: 0,
					duration: 1.2,
					ease: 'power4.inOut'
				},
				3.4
			);
			tl.to(
				'.move-down-one, .move-down-two',
				{
					y: '-100%',
					duration: 1.2,
					ease: 'power4.inOut'
				},
				3.4
			);

			// Words Unfold out from behind the initials
			tl.to(
				'.tagline-rest',
				{
					x: 0,
					autoAlpha: 1,
					clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out'
				},
				4.0
			);

			// ------------------------------------------------------------
			// 5. TAGLINE ZOOM
			// ------------------------------------------------------------

			tl.to(
				'.tagline',
				{
					z: 500,
					scale: 5,
					opacity: 0,
					duration: 3.6,
					ease: 'power4.in'
				},
				5.2
			);

			// ------------------------------------------------------------
			// 6. FINAL DOT
			// ------------------------------------------------------------

			gsap.set('.black-dot', {
				scale: 0,
				autoAlpha: 1,
				transformOrigin: '50% 50%'
			});

			gsap.set('.final-dot', {
				scale: 0,
				autoAlpha: 1,
				transformOrigin: '50% 50%'
			});

			tl.to(
				'.black-dot',
				{
					z: 500,
					scale: 40,
					duration: 3.5,
					ease: 'power2.inOut'
				},
				6.6
			);

			tl.to(
				'.final-dot',
				{
					scale: 1,
					duration: 3,
					ease: 'power2.inOut'
				},
				8
			);

			tl.to(
			'.final-dot-img',
			{
			    clipPath: "inset(0% 0% 0% 0%)",
				scale: 1,
				duration: 3,
				ease: 'power2.out'
			},
			8
			);
		}, root);

		return () => ctx.revert();
	});
</script>

<div
	bind:this={root}
	class="loader-stage relative flex h-screen w-screen overflow-hidden bg-black font-singo-sans perspective-[1000px]"
>
	<!-- STAGE 1: LOGO -->
	<div
		class="loader-logo absolute left-1/2 top-[47%] z-10 -translate-x-1/2 -translate-y-1/2 text-white will-change-transform preserv"
	>
		<!-- AR -->
		<div class="top-logo-part flex h-32 overflow-hidden">
			<div class="flex flex-col">
				<span class="logo-letter inline-block text-[8.5rem] leading-none">A</span>
			</div>

			<div class="flex flex-col">
				<span class="logo-letter inline-block text-[8.5rem] leading-none">R</span>
			</div>
		</div>

		<!-- QO -->
		<div class="bottom-logo-part flex h-32 overflow-hidden">
			<div class="flex flex-col">
				<span class="logo-letter inline-block text-[8.5rem] leading-none">Q</span>
			</div>

			<div class="flex flex-col">
				<span class="logo-letter inline-block text-[8.5rem] leading-none">O</span>
			</div>
		</div>
	</div>

	<div
		class="white-circle absolute left-1/2 top-1/2 z-20 h-[2rem] w-[2rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
	></div>

	<div
		class="black-circle absolute left-1/2 top-1/2 z-30 h-[2rem] w-[2rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
	></div>

	<!-- STAGE 4: TAGLINE (white on black) -->
	<div
		class="tagline pointer-events-none absolute left-1/2 top-1/2 z-40 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-y-4 text-center text-white will-change-transform"
		style="opacity: 0;"
	>
		<!-- ROW 1: Architecture. & Research. -->
		<div class="flex items-center justify-center gap-x-8">
			<!-- A -->
			<div class="tagline-word inline-flex items-baseline text-7xl leading-none">
				<div class="relative h-20 overflow-hidden">
					<div class="flex flex-col">
						<span class="move-up-one inline-block text-7xl leading-none">A</span>
						<span class="move-up-two inline-block text-7xl leading-none">A</span>
					</div>
				</div>
				<span class="tagline-rest inline-block">rchitecture.</span>
			</div>

			<!-- R -->
			<div class="tagline-word inline-flex items-baseline text-7xl leading-none">
				<div class="relative h-20 overflow-hidden">
					<div class="flex flex-col">
						<span class="move-down-one inline-block text-7xl leading-none">R</span>
						<span class="move-down-two inline-block text-7xl leading-none">R</span>
					</div>
				</div>
				<span class="tagline-rest inline-block">esearch.</span>
			</div>
		</div>

		<!-- ROW 2: Quality. & Originality. -->
		<div class="flex items-center justify-center gap-x-8">
			<!-- Q -->
			<div class="tagline-word inline-flex items-baseline text-7xl leading-none">
				<div class="relative h-20 overflow-hidden">
					<div class="flex flex-col">
						<span class="move-up-one inline-block text-7xl leading-none">Q</span>
						<span class="move-up-two inline-block text-7xl leading-none">Q</span>
					</div>
				</div>
				<span class="tagline-rest inline-block">uality.</span>
			</div>

			<!-- O -->
			<div class="tagline-word tagline-dot-anchor inline-flex items-baseline text-7xl leading-none">
				<div class="relative h-20 overflow-hidden">
					<div class="flex flex-col">
						<span class="move-down-one inline-block text-7xl leading-none">O</span>
						<span class="move-down-two inline-block text-7xl leading-none">O</span>
					</div>
				</div>
				<span class="tagline-rest inline-block">riginality.</span>
			</div>
		</div>
	</div>

	<!-- STAGE 6: BLACK DOT -->
	<div
		class="black-dot pointer-events-none absolute left-1/2 top-1/2 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black will-change-transform opacity-0"
	></div>

	<!-- COLORED DOT INSIDE -->
	<div
		class="final-dot pointer-events-none absolute left-1/2 top-1/2 z-[60] h-72 w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full will-change-transform opacity-0"
	>
	        <img
                src="/modern-glass-building.jpg"
                alt="Hero background"
                class="hero-image h-full w-full object-cover [clip-path:inset(25%_25%_25%_25%)] scale-200"
            />
	</div>
</div>
