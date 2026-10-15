<script lang="ts">
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { productSlides } from '$lib/constants/productItems';

	gsap.registerPlugin(ScrollTrigger);

	let featureSection: HTMLElement;
	let featureLine: SVGLineElement;
	let featureImageA: HTMLImageElement;
	let featureImageB: HTMLImageElement;
	let showMoreLink: HTMLAnchorElement;
	let titleLayerA!: HTMLDivElement;
	let titleLayerB!: HTMLDivElement;
	let numberLayerA!: HTMLSpanElement;
	let numberLayerB!: HTMLSpanElement;
	let intervalId: ReturnType<typeof setInterval> | undefined;
	let transitionTimeline: gsap.core.Timeline | undefined;

	let activeProductIndex = $state(0);
	let layerProductIndices = $state([0, 0]);
	let activeLayer = $state(0);
	let incomingLayer = $state(1);
	let transitioning = false;

	const preloadedImages = new Map<string, Promise<void>>();

	function preloadProductImage(src: string) {
		const existing = preloadedImages.get(src);
		if (existing) return existing;

		const image = new Image();
		image.src = src;
		const ready = image.decode().catch(() => {});
		preloadedImages.set(src, ready);
		return ready;
	}

	async function showNextProduct() {
		if (transitioning) return;
		transitioning = true;

		const nextIndex = (activeProductIndex + 1) % productSlides.length;
		const nextLayer = 1 - activeLayer;
		const incomingImage = nextLayer === 0 ? featureImageA : featureImageB;
		const outgoingImage = activeLayer === 0 ? featureImageA : featureImageB;
		const incomingTitle = nextLayer === 0 ? titleLayerA : titleLayerB;
		const outgoingTitle = activeLayer === 0 ? titleLayerA : titleLayerB;
		const incomingNumber = nextLayer === 0 ? numberLayerA : numberLayerB;
		const outgoingNumber = activeLayer === 0 ? numberLayerA : numberLayerB;

		await preloadProductImage(productSlides[nextIndex].img);

		incomingLayer = nextLayer;
		layerProductIndices = layerProductIndices.map((slideIndex, layer) =>
			layer === nextLayer ? nextIndex : slideIndex
		);
		activeProductIndex = nextIndex;
		await tick();
		await incomingImage.decode().catch(() => {});

		gsap.set(outgoingImage, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
		gsap.set(incomingImage, {
			autoAlpha: 1,
			yPercent: 16,
			scale: 1.2,
			clipPath: 'inset(100% 0% 0% 0%)'
		});
		gsap.set(outgoingTitle, { autoAlpha: 1, yPercent: 0 });
		gsap.set(incomingTitle, { autoAlpha: 1, yPercent: 110 });
		gsap.set(outgoingNumber, { autoAlpha: 1, yPercent: 0 });
		gsap.set(incomingNumber, { autoAlpha: 1, yPercent: 110 });

		transitionTimeline = gsap.timeline({
			onComplete: () => {
				activeLayer = nextLayer;
				gsap.set(outgoingImage, { autoAlpha: 0, clearProps: 'clipPath,transform' });
				gsap.set(incomingImage, { autoAlpha: 1, clearProps: 'clipPath,transform' });
				gsap.set(outgoingTitle, { autoAlpha: 0, clearProps: 'transform' });
				gsap.set(incomingTitle, { autoAlpha: 1, clearProps: 'transform' });
				gsap.set(outgoingNumber, { autoAlpha: 0, clearProps: 'transform' });
				gsap.set(incomingNumber, { autoAlpha: 1, clearProps: 'transform' });
				transitioning = false;
			}
		});

		const showMoreIsVisible = Number(gsap.getProperty(showMoreLink, 'opacity')) > 0.5;
		if (showMoreIsVisible) {
			transitionTimeline
				.to(showMoreLink, { autoAlpha: 0, y: -12, duration: 0.6, ease: 'power3.inOut' }, 0)
				.fromTo(
					showMoreLink,
					{ autoAlpha: 0, y: 12 },
					{ autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.inOut' },
					0.66
				);
		}

		transitionTimeline
			.to(outgoingTitle, { yPercent: -110, duration: 0.6, ease: 'power3.inOut' }, 0)
			.to(incomingTitle, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' }, 0.66)
			.to(outgoingNumber, { yPercent: -110, duration: 0.6, ease: 'power3.inOut' }, 0)
			.to(incomingNumber, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' }, 0.66)
			.to(
				outgoingImage,
				{
					yPercent: -12,
					clipPath: 'inset(0% 0% 100% 0%)',
					duration: 0.95,
					ease: 'power3.inOut'
				},
				0
			)
			.to(
				incomingImage,
				{
					yPercent: 0,
					clipPath: 'inset(0% 0% 0% 0%)',
					duration: 0.7,
					ease: 'power3.inOut'
				},
				0.66
			)
			.to(incomingImage, { scale: 1, duration: 0.7, ease: 'power3.out' }, 0.66);
	}

	onMount(() => {
		let cancelled = false;

		productSlides.forEach(({ img }) => preloadProductImage(img));

		const ctx = gsap.context(() => {
			gsap.set('.discover-product-heading', { autoAlpha: 0, y: 20 });
			gsap.set(featureImageA, { scale: 1.2, autoAlpha: 1 });
			gsap.set(featureImageB, { scale: 1.2, autoAlpha: 0 });
			gsap.set(featureLine, { attr: { x1: 50, x2: 50 } });
			gsap.set('.product-show-more', { autoAlpha: 0, y: 24 });
			gsap.set(titleLayerA, { autoAlpha: 1, yPercent: 100 });
			gsap.set(titleLayerB, { autoAlpha: 0, yPercent: 100 });
			gsap.set(numberLayerA, { autoAlpha: 1, yPercent: 100 });
			gsap.set(numberLayerB, { autoAlpha: 0, yPercent: 100 });
		}, featureSection);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				ScrollTrigger.create({
					trigger: featureSection,
					start: 'top 52%',
					once: true,
					onEnter: () => {
						gsap
							.timeline()
							.to(
								'.discover-product-heading',
								{ autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
								0
							)
							.to(featureLine, { attr: { x1: 0, x2: 100 }, duration: 1.3, ease: 'power3.inOut' }, 0)
							.to(featureImageA, { scale: 1, duration: 1.3, ease: 'power3.out' }, 0)
							.to(titleLayerA, { yPercent: 0, duration: 0.8, ease: 'power3.out' }, 0)
							.to(numberLayerA, { yPercent: 0, duration: 0.8, ease: 'power3.out' }, 0)
							.to(
								'.product-show-more',
								{ autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
								1.5
							);
					}
				});

				intervalId = setInterval(() => void showNextProduct(), 5000);
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
			transitionTimeline?.kill();
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<section
	bind:this={featureSection}
	id="product-range"
	class="min-h-screen overflow-hidden bg-black px-5 pt-7 pb-12 font-antonio text-white md:px-10"
	aria-labelledby="discover-product-heading"
>
	<h2
		id="discover-product-heading"
		class="discover-product-heading flex justify-center pb-6 font-sans text-xs tracking-[0.12em] uppercase"
		aria-label="Discover our product"
	>
		<span aria-hidden="true">Discover Our Product</span>
	</h2>

	<svg
		class="block h-[2px] w-full"
		viewBox="0 0 100 2"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<line
			bind:this={featureLine}
			x1="50"
			y1="1"
			x2="50"
			y2="1"
			stroke="white"
			stroke-width="2"
			vector-effect="non-scaling-stroke"
		/>
	</svg>

	<div class="relative mx-auto mt-12 min-h-[70svh] max-w-[100rem] md:mt-16">
		<div
			class="pointer-events-none absolute right-[10%] bottom-0 z-0 h-[1em] w-[1.4em] overflow-hidden font-antonio text-[clamp(7rem,20vw,20rem)] leading-none"
			aria-hidden="true"
		>
			<span
				bind:this={numberLayerA}
				class="absolute inset-0 flex items-end whitespace-nowrap"
				style:z-index={incomingLayer === 0 ? 2 : 1}
			>
				#{productSlides[layerProductIndices[0]].num}
			</span>
			<span
				bind:this={numberLayerB}
				class="absolute inset-0 flex items-end whitespace-nowrap"
				style:z-index={incomingLayer === 1 ? 2 : 1}
			>
				#{productSlides[layerProductIndices[1]].num}
			</span>
		</div>

		<div
			class="absolute top-28 left-[5%] z-10 h-[min(50svh,26rem)] w-[90%] overflow-hidden bg-white/5 md:top-[5%] md:left-[24%] md:h-[min(62svh,28rem)] md:w-[min(46vw,38rem)]"
		>
			<img
				bind:this={featureImageA}
				src={productSlides[layerProductIndices[0]].img}
				alt={productSlides[layerProductIndices[0]].alt}
				aria-hidden={activeLayer !== 0}
				style:z-index={incomingLayer === 0 ? 2 : 1}
				loading="lazy"
				decoding="async"
				class="absolute inset-0 h-full w-full object-cover"
			/>
			<img
				bind:this={featureImageB}
				src={productSlides[layerProductIndices[1]].img}
				alt={productSlides[layerProductIndices[1]].alt}
				aria-hidden={activeLayer !== 1}
				style:z-index={incomingLayer === 1 ? 2 : 1}
				loading="lazy"
				decoding="async"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</div>

		<div class="absolute top-3 left-[19%] z-20 w-[78%] md:top-[-2.5rem] md:left-[56%] md:w-[42%]">
			<h3
				class="relative h-[2.2em] overflow-hidden font-antonio text-[clamp(3rem,9.5vw,9rem)] leading-[1.1] tracking-[-0.03em] uppercase"
				aria-label={productSlides[activeProductIndex].lines.join(' ')}
			>
				<div
					bind:this={titleLayerA}
					class="absolute inset-x-0 top-0"
					aria-hidden="true"
					style:z-index={incomingLayer === 0 ? 2 : 1}
				>
					{#each productSlides[layerProductIndices[0]].lines as line, lineIndex (lineIndex)}
						<span class="block">{line}</span>
					{/each}
				</div>
				<div
					bind:this={titleLayerB}
					class="absolute inset-x-0 top-0"
					aria-hidden="true"
					style:z-index={incomingLayer === 1 ? 2 : 1}
				>
					{#each productSlides[layerProductIndices[1]].lines as line, lineIndex (lineIndex)}
						<span class="block">{line}</span>
					{/each}
				</div>
			</h3>

			<a
				bind:this={showMoreLink}
				href="#installation-options"
				class="product-show-more mt-4 inline-flex items-center gap-2 font-sans text-[10px] uppercase underline underline-offset-4 md:text-xs"
			>
				Show more <span aria-hidden="true">↗</span>
			</a>
		</div>
	</div>
</section>
