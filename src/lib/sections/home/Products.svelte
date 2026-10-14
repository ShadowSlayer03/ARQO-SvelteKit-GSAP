<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	import productItems from '$lib/constants/productItems';
	import TextMarquee from '$lib/components/TextMarquee.svelte';

	let root: HTMLDivElement;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.set('.marquee-layer', {
				yPercent: 100
			});

			gsap.set('.product0-image-container', {
				height: 0,
				scale: 1.2,
				left: '8%',
				top: '5%'
			});

			gsap.set('.product1-image-container', {
				height: 0,
				scale: 1.2,
				right: '12%',
				top: '19%'
			});

			gsap.set('.product2-image-container', {
				height: 0,
				scale: 1.2,
				left: '14%',
				top: '38%'
			});

			gsap.set('.product3-image-container', {
				height: 0,
				scale: 1.2,
				right: '15%',
				top: '54%'
			});

			gsap.set('.product4-image-container', {
				height: 0,
				scale: 1.2,
				left: '10%',
				top: '72%'
			});
		}, root);

		return () => ctx.revert();
	});

	const play = (row: HTMLElement, hovering: boolean, index: number) => {
		const q = gsap.utils.selector(row);

		const opts = {
			duration: 0.8,
			ease: 'circ.inOut',
			overwrite: 'auto' as const
		};

		gsap.to(q('.gray-layer'), {
			yPercent: hovering ? -150 : 0,
			...opts
		});

		gsap.to(q('.marquee-layer'), {
			yPercent: hovering ? 0 : 150,
			...opts
		});

		gsap.to(q('.marquee-text'), {
			x: hovering ? -1000 : 0,
			scale: hovering ? 1.1 : 1,
			duration: 3,
			ease: hovering ? 'power3.inOut' : 'power3.out',
			overwrite: 'auto'
		});

		gsap.to(q(`.product${index}-image-container`), {
			height: hovering ? '20.5rem' : 0,
			scale: hovering ? 1 : 1.2,
			duration: 2.5,
			ease: hovering ? 'power3.inOut' : 'power3.out',
			overwrite: 'auto'
		});
	};
</script>

<div
	bind:this={root}
	id="all-products"
	class="relative flex min-h-screen w-screen flex-col items-center bg-black py-10"
>
	<h3 class="font-sans text-lg text-white uppercase">Discover Our Products</h3>

	<div class="product-texts w-full pt-10">
		{#each productItems as product, id (product + id.toString())}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex w-full cursor-pointer justify-center pt-8"
				onmouseenter={(e) => play(e.currentTarget, true, id)}
				onmouseleave={(e) => play(e.currentTarget, false, id)}
			>
				<div class="relative z-100 h-[1.1em] w-full overflow-hidden text-9xl leading-none">
					<span
						class="gray-layer block text-center font-antonio tracking-wide text-gray-500/40 will-change-transform"
					>
						{product.name}
					</span>

					<div class="marquee-layer absolute inset-0 w-full will-change-transform">
						<TextMarquee text={product.name} />
					</div>
				</div>

				<div class={`product${id}-image-container absolute z-50 h-82 w-64 rounded-md bg-red-500 `}>
					<img class="h-full w-full object-cover" src={product.image} alt={product.alt} />
				</div>
			</div>
		{/each}
	</div>
</div>
