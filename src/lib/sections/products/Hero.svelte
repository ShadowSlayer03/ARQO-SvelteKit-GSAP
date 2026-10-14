<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';

	import TextReveal from '$lib/components/TextReveal.svelte';

	let root: HTMLElement;
	let heading: ReturnType<typeof TextReveal>;

	onMount(() => {
		let cancelled = false;

		const ctx = gsap.context(() => {
			gsap.set('.products-hero-fade', { opacity: 0, y: 20 });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				gsap.timeline({ delay: 0.15 }).add(heading.reveal(1.2), 0).add(heading.swap(1), 1.35).to(
					'.products-hero-fade',
					{
						opacity: 1,
						y: 0,
						duration: 0.9,
						ease: 'power3.out',
						stagger: 0.1
					},
					0.45
				);
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});

	function scrollToProducts(event: MouseEvent) {
		event.preventDefault();

		const target = document.getElementById('product-range');
		const smoother = ScrollSmoother.get();

		if (target && smoother) {
			smoother.scrollTo(target, true);
		} else {
			target?.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section
	bind:this={root}
	class="relative isolate min-h-[100svh] overflow-hidden bg-black"
	aria-labelledby="products-heading"
>
	<div class="absolute inset-x-0 top-0 h-[68svh] max-h-[52rem] min-h-[30rem] overflow-hidden">
		<img
			src="/modern-glass-building.jpg"
			alt="Modern glass building facade beneath a clear blue sky"
			fetchpriority="high"
			decoding="async"
			class="h-full w-full object-cover object-center"
		/>
		<div
			class="absolute inset-0 bg-linear-to-b from-black/15 via-black/5 to-black/80"
			aria-hidden="true"
		></div>
	</div>

	<div
		class="products-hero-fade absolute top-[25%] left-5 text-[10px] tracking-[0.18em] uppercase md:left-10 md:text-xs"
	>
		[ Architectural systems ]
	</div>
	<div
		class="products-hero-fade absolute top-[65%] right-5 text-right text-[10px] tracking-[0.18em] uppercase md:right-10 md:text-xs"
	>
		[ Built to perform ]
	</div>

	<h1
		id="products-heading"
		class="absolute top-[45%] left-0 flex w-full -translate-y-1/2 justify-center px-2 text-center"
		aria-label="Products"
	>
		<span aria-hidden="true">
			<TextReveal
				bind:this={heading}
				text="Products"
				textClass="lowercase text-[20rem] leading-[1.04]"
				heightClass="h-84"
			/>
		</span>
	</h1>

	<a
		href="#product-range"
		onclick={scrollToProducts}
		class="products-hero-fade group absolute top-[74%] left-1/2 flex h-12 w-[90%] -translate-x-1/2 items-center justify-center rounded-full bg-white px-6 text-center font-sans text-xs tracking-wide text-black transition-colors duration-300 hover:bg-white/85 sm:w-[74%] sm:text-sm"
	>
		<span>Find your product</span>
		<span
			class="absolute right-5 transition-transform duration-300 group-hover:translate-y-0.5"
			aria-hidden="true"
		>
			↓
		</span>
	</a>
</section>
