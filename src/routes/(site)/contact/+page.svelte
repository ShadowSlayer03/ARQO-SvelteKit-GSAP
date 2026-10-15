<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import TextReveal from '$lib/components/TextReveal.svelte';

	let root: HTMLElement;
	let heading: ReturnType<typeof TextReveal>;
	let ready = false;

	onMount(() => {
		let cancelled = false;

		const ctx = gsap.context(() => {
			gsap.set('.ct-fade', { opacity: 0, y: 24 });
			gsap.set('.ct-img', { clipPath: 'inset(0% 0% 100% 0%)' });
			gsap.set('.ct-img img', { scale: 1.2, filter: 'grayscale(1)' });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				const tl = gsap.timeline({ delay: 0.2, onComplete: () => (ready = true) });

				tl.add(heading.reveal(1.2), 0);
				tl.add(heading.swap(1.2), 1.2 + 0.15);

				tl.to('.ct-fade', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.9);

				tl
				.to('.ct-img', { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power4.inOut' }, 0.9)
				.to('.ct-img img', { scale: 1, duration: 2, ease: 'power3.out' }, 0.9);
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});

	// hover: image scales up and gains colour
	function hoverImage(on: boolean) {
		if (!ready) return;
		gsap.to('.ct-img img', {
			scale: on ? 1.08 : 1,
			filter: on ? 'grayscale(0)' : 'grayscale(1)',
			duration: 0.9,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	}
</script>

<svelte:head>
	<title>Contact — ARQO</title>
</svelte:head>

<main
	bind:this={root}
	class="min-h-screen w-screen bg-black px-5 pb-10 pt-32 font-sans text-white md:px-10"
>
	<section class="min-h-[calc(100vh-9rem)]">
    	<h1
    		class="font-antonio text-[clamp(4rem,11vw,10rem)] uppercase tracking-tight"
    		aria-label="Contact Us"
    	>
    		<div aria-hidden="true">
       			<TextReveal
						bind:this={heading}
						text="Contact Us"
						textClass="leading-[1.04] tracking-normal"
						heightClass="h-[1.1em]"
					/>
    		</div>
    	</h1>

		<div class="mt-12 grid grid-cols-1 gap-10 md:mt-18 md:grid-cols-[1fr_1fr_1.8fr] md:items-start md:gap-12 lg:gap-20">
			<div class="grid grid-cols-2 gap-x-8 gap-y-14 md:col-span-2 justify-start">
				<div class="ct-fade">
					<h2 class="mb-2 text-sm font-semibold uppercase">ARQO</h2>
					<div class="text-lg leading-tight text-white/60">
						<p>Nyhavn 23, 1051</p>
						<p>Copenhagen, Denmark</p>
						<p class="mt-3">CVR no.: DK56812374</p>
					</div>
				</div>

				<div class="ct-fade">
					<h2 class="mb-2 text-sm font-semibold uppercase">Opening Hours</h2>
					<div class="text-lg leading-tight text-white/60">
						<p>Mon – Fri: 9 AM – 6 PM</p>
						<p>Sat – Sun: Closed</p>
					</div>
				</div>

				<div class="ct-fade">
					<h2 class="mb-2 text-sm font-semibold uppercase">Phone</h2>
					<a href="tel:+4532560043" class="text-lg text-white/60 underline underline-offset-4">
						+45 3256 0043
					</a>
				</div>

				<div class="ct-fade">
					<h2 class="mb-2 text-sm font-semibold uppercase">Email</h2>
					<a href="mailto:hello@arqo.com" class="text-lg text-white/60 underline underline-offset-4">
						hello@arqo.com
					</a>
				</div>
			</div>

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="ct-img h-[20rem] overflow-hidden md:h-[18rem] lg:h-[22rem] rounded-md"
				onmouseenter={() => hoverImage(true)}
				onmouseleave={() => hoverImage(false)}
			>
				<img
					class="h-full w-full object-cover will-change-transform"
					src="/arqo-hq.png"
					alt="ARQO HQ building"
				/>
			</div>
		</div>
	</section>
</main>
