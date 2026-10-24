<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { getSite } from '$lib/siteContext';

	import gsap from 'gsap';
	import { register } from 'swiper/element/bundle';

	import TextReveal from '$lib/components/TextReveal.svelte';
	import images from '$lib/generated/reference-images';

	type SwiperInstance = {
		setProgress: (progress: number, speed?: number) => void;
		destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
	};

	type SwiperElement = HTMLElement & {
		initialize: () => void;
		swiper?: SwiperInstance;
	};

	type TextRevealInstance = {
		reveal: (duration?: number) => gsap.core.Timeline;
		swap: (duration?: number) => gsap.core.Timeline;
	};

	type GalleryItem = {
		path: string;
		fullPath: string;
		position: 'top' | 'bottom';
		gap: 'normal' | 'large';
		location: string;
		architect: string;
		investor: string;
		buildingType: string;
		productType: string;
	};

	type ExpandedProject = {
		path: string;
		fullPath: string;
		alt: string;
		year: string;
		location: string;
		architect: string;
		investor: string;
		buildingType: string;
		productType: string;
	};

	let root: HTMLElement;
	let track: HTMLElement;
	let cursor: HTMLElement;

	let title: TextRevealInstance;
	let count: TextRevealInstance;

	let swiperEl: SwiperElement | null = null;
	let expandedLayer: HTMLDivElement | undefined;
	let expandedBackdrop: HTMLDivElement | undefined;
	let expandedMarquee: HTMLDivElement | undefined;
	let expandedCard: HTMLDivElement | undefined;
	let expandedImage: HTMLImageElement | undefined;
	let expandedStartRect: DOMRect | null = null;
	let expandedTimeline: gsap.core.Timeline | null = null;
	let previousBodyOverflow = '';

	let expandedProject = $state<ExpandedProject | null>(null);

	let newestFirst = $state(false);
	let selectedYear = $state('2022');
	let sliderProgress = $state(0.5);
	let draggingSlider = $state(false);

	let galleryPlayed = false;

	let site = getSite();

	let moveX: (value: number) => void = () => {};
	let moveY: (value: number) => void = () => {};

	const allReferenceItemsBasedOnYear = $derived(
		Object.values(Object.groupBy(images, (item) => item.year))
			.filter((items) => items !== undefined)
			.map((items) => ({
				year: items[0].year,
				projects: items
			}))
			.sort((a, b) => a.year.localeCompare(b.year))
	);

	const total = $derived(
		allReferenceItemsBasedOnYear.reduce((sum, item) => sum + item.projects.length, 0)
	);

	const years = $derived(
		newestFirst ? [...allReferenceItemsBasedOnYear].reverse() : allReferenceItemsBasedOnYear
	);

	const selectedYearData = $derived(
		years.find((item) => item.year === selectedYear) ?? years[0]
	);

	const currentProjects = $derived(selectedYearData?.projects ?? []);

	const startYear = $derived(years[0]?.year ?? '');
	const endYear = $derived(years.at(-1)?.year ?? '');

	const selectedYearIndex = $derived(
		Math.max(
			0,
			years.findIndex((item) => item.year === selectedYear)
		)
	);

	const selectedYearProgress = $derived(
		years.length > 1 ? selectedYearIndex / (years.length - 1) : 0
	);

	const sliderYear = $derived.by(() => {
		if (!years.length) return '';

		const index = Math.round(sliderProgress * (years.length - 1));

		return years[index]?.year ?? '';
	});

	const galleryItems = $derived.by(() => {
		const pattern: Omit<GalleryItem, 'path' | 'fullPath'>[] = [
			{ position: 'bottom', gap: 'normal' },
			{ position: 'bottom', gap: 'large' },
			{ position: 'top', gap: 'normal' },
			{ position: 'bottom', gap: 'large' },
			{ position: 'top', gap: 'normal' },
			{ position: 'top', gap: 'large' },
			{ position: 'bottom', gap: 'normal' },
			{ position: 'top', gap: 'normal' },
			{ position: 'top', gap: 'large' },
			{ position: 'bottom', gap: 'normal' }
		];

		return currentProjects.map((project, index) => ({
			path: project.path,
			fullPath: project.fullPath,
			location: project.location,
            architect: project.architect,
            investor: project.investor,
            buildingType: project.buildingType,
            productType: project.productType,
			position: pattern[index]?.position ?? 'top',
			gap: pattern[index]?.gap ?? 'large'
		}));
	});

	onMount(() => {
		register();

		let cancelled = false;

		sliderProgress = selectedYearProgress;

		const ctx = gsap.context(() => {
			gsap.set('.rf-fade', {
				opacity: 0,
				y: 20
			});

			gsap.set(cursor, {
				opacity: 0,
				scale: 0
			});

			moveX = gsap.quickTo(cursor, 'x', {
				duration: 0.5,
				ease: 'power3.out'
			});

			moveY = gsap.quickTo(cursor, 'y', {
				duration: 0.5,
				ease: 'power3.out'
			});
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				gsap
					.timeline({ delay: 0.2 })
					.add(title.reveal(1.2), 0)
					.add(count.reveal(1.2), 0)
					.add(title.swap(1), 1.35)
					.add(count.swap(1), 1.35)
					.to(
						'.rf-fade',
						{
							opacity: 1,
							y: 0,
							duration: 1,
							ease: 'power3.out',
							stagger: 0.1
						},
						0.9
					);
			});
		});

		return () => {
			cancelled = true;
			expandedTimeline?.kill();
			document.removeEventListener('keydown', handleExpandKeydown);

			if (expandedProject) {
				document.body.style.overflow = previousBodyOverflow;
			}

			ctx.revert();
		};
	});

	function gallery(node: HTMLElement) {
		register();

		const swiperElement = node as SwiperElement;

		const cards = node.querySelectorAll<HTMLElement>('.ref-card');
		const images = node.querySelectorAll<HTMLImageElement>('.ref-img');

		swiperEl = swiperElement;

		gsap.set(cards, {
			opacity: 0,
			y: 40
		});

		gsap.set(images, {
			scale: 1.12
		});

		Object.assign(swiperElement, {
			slidesPerView: 'auto',
			spaceBetween: 0,
			freeMode: {
				enabled: true,
				momentum: true,
				momentumRatio: 0.8,
				momentumVelocityRatio: 0.8
			},
			speed: 900,
			grabCursor: true,
			watchOverflow: false
		});

		swiperElement.initialize();

		let cancelled = false;

		document.fonts.ready.then(() => {
			if (cancelled) return;

			const delay = galleryPlayed ? 0.05 : 0.6;

			galleryPlayed = true;

			gsap.to(cards, {
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power4.out',
				stagger: {
					amount: 0.7
				},
				delay
			});

			gsap.to(images, {
				scale: 1,
				duration: 1.6,
				ease: 'power3.out',
				stagger: {
					amount: 0.9
				},
				delay
			});
		});

		return {
			destroy() {
				cancelled = true;

				gsap.killTweensOf(cards);
				gsap.killTweensOf(images);

				swiperElement.swiper?.destroy(true, true);

				if (swiperEl === swiperElement) {
					swiperEl = null;
				}
			}
		};
	}

	function getSliderProgress(clientX: number) {
		const rect = track.getBoundingClientRect();

		return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
	}

	function updateSlider(clientX: number) {
		sliderProgress = getSliderProgress(clientX);
	}

	function selectNearestYear() {
		if (!years.length) return;

		const index = Math.round(sliderProgress * (years.length - 1));
		const year = years[index]?.year;

		if (!year) return;

		selectedYear = year;

		const snappedProgress = years.length > 1 ? index / (years.length - 1) : 0;

		gsap.to(
			{ value: sliderProgress },
			{
				value: snappedProgress,
				duration: 0.45,
				ease: 'power3.out',
				onUpdate() {
					sliderProgress = gsap.getProperty(this.targets()[0], 'value') as number;
				}
			}
		);
	}

	function startSliderDrag(event: PointerEvent) {
		draggingSlider = true;
		track.setPointerCapture(event.pointerId);
		updateSlider(event.clientX);
	}

	function dragSlider(event: PointerEvent) {
		if (!draggingSlider) return;

		updateSlider(event.clientX);
	}

	function endSliderDrag(event: PointerEvent) {
		if (!draggingSlider) return;

		draggingSlider = false;

		if (track.hasPointerCapture(event.pointerId)) {
			track.releasePointerCapture(event.pointerId);
		}

		selectNearestYear();
	}

	function clickSlider(event: MouseEvent) {
		if (draggingSlider) return;

		updateSlider(event.clientX);
		selectNearestYear();
	}

	function moveCursor(event: MouseEvent) {
		const element = event.currentTarget as HTMLElement;
		const rect = element.getBoundingClientRect();

		moveX(event.clientX - rect.left);
		moveY(event.clientY - rect.top);
	}

	function showCursor(show: boolean) {
		gsap.to(cursor, {
			opacity: show ? 1 : 0,
			scale: show ? 1 : 0,
			duration: 0.4,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	}

	function pressCursor(pressed: boolean) {
		gsap.to(cursor, {
			scale: pressed ? 0.8 : 1,
			duration: 0.3,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	}

	function handleSwiperContainerMouseEnter() {
		site.setShowMousePointer(false);
		showCursor(true);
	}

	function handleSwiperContainerMouseExit() {
		site.setShowMousePointer(true);
		showCursor(false);
	}

	async function handleImgExpand(event: MouseEvent, item: GalleryItem, index: number) {
		if (expandedProject) return;

		const sourceImage = (event.currentTarget as HTMLButtonElement).querySelector('img');
		if (!sourceImage) return;

		const preload = new Image();
		preload.src = item.fullPath;

		try {
			await preload.decode();
		} catch {
			console.error('Could not load the expanded image:', item.fullPath);
			return;
		}

		if (expandedProject) return;

		previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const startRect = sourceImage.getBoundingClientRect();
		if (!startRect.width || !startRect.height) {
			document.body.style.overflow = previousBodyOverflow;
			return;
		}

		expandedStartRect = startRect;

		expandedProject = {
			path: item.path,
			fullPath: item.fullPath,
			alt: `ARQO reference project ${index + 1} — ${selectedYear}`,
			year: selectedYear,
			location: item.location,
			architect: item.architect,
			investor: item.investor,
			buildingType: item.buildingType,
			productType: item.productType
		};

		document.addEventListener('keydown', handleExpandKeydown);
		await tick();

		if (!expandedLayer || !expandedBackdrop || !expandedMarquee || !expandedCard || !expandedImage) {
			document.removeEventListener('keydown', handleExpandKeydown);
			expandedProject = null;
			expandedStartRect = null;
			document.body.style.overflow = previousBodyOverflow;
			return;
		}

		const targetRect = expandedImage.getBoundingClientRect();
		const details = expandedCard.querySelectorAll<HTMLElement>('.expanded-details');

		gsap.set(expandedImage, {
			position: 'fixed',
			left: startRect.left,
			top: startRect.top,
			width: startRect.width,
			height: startRect.height,
			maxWidth: 'none',
			maxHeight: 'none',
			margin: 0,
			objectFit: 'cover',
			zIndex: 2000
		});
		gsap.set(expandedLayer, { autoAlpha: 1 });
		gsap.set(expandedCard, { autoAlpha: 1 });
		gsap.set(expandedBackdrop, { autoAlpha: 0 });
		gsap.set(expandedMarquee, { autoAlpha: 0 });
		gsap.set(details, { autoAlpha: 0, y: 12 });

		expandedTimeline = gsap.timeline();

		expandedTimeline
			.to(expandedBackdrop, {
				autoAlpha: 1,
				duration: 0.45,
				ease: 'power2.out'
			}, 0)
			.to(expandedImage, {
				left: targetRect.left,
				top: targetRect.top,
				width: targetRect.width,
				height: targetRect.height,
				duration: 0.8,
				ease: 'power3.inOut'
			}, 0)
			.to(expandedMarquee, {
				autoAlpha: 1,
				duration: 0.5,
				ease: 'power2.out'
			}, 0.15)
			.to(details, {
				autoAlpha: 1,
				y: 0,
				duration: 0.4,
				ease: 'power3.out',
				stagger: 0.04
			}, 0.35);
	}

	function closeImgExpand() {
		if (!expandedProject || !expandedLayer || !expandedBackdrop || !expandedMarquee || !expandedImage || !expandedStartRect) return;

		expandedTimeline?.kill();
		const startRect = expandedStartRect;
		const details = expandedCard?.querySelectorAll<HTMLElement>('.expanded-details');

		expandedTimeline = gsap.timeline({
			onComplete: () => {
				document.removeEventListener('keydown', handleExpandKeydown);
				expandedProject = null;
				expandedStartRect = null;
				expandedTimeline = null;
				document.body.style.overflow = previousBodyOverflow;
			}
		});

		expandedTimeline
			.to(expandedImage, {
				left: startRect.left,
				top: startRect.top,
				width: startRect.width,
				height: startRect.height,
				objectFit: 'cover',
				duration: 0.65,
				ease: 'power3.inOut'
			}, 0)
			.to(expandedBackdrop, {
				autoAlpha: 0,
				duration: 0.5,
				ease: 'power2.in'
			}, 0.05)
			.to(expandedMarquee, {
				autoAlpha: 0,
				duration: 0.3,
				ease: 'power2.in'
			}, 0)
			.to(details ?? [], {
				autoAlpha: 0,
				y: 8,
				duration: 0.25,
				ease: 'power2.in',
				stagger: 0.02
			}, 0);
	}

	function handleExpandKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeImgExpand();
	}

</script>

<svelte:head>
	<title>References | ARQO</title>
	<meta name="description" content="Explore ARQO reference projects across Europe from 2017 to 2026." />
</svelte:head>


<main bind:this={root} class="min-h-screen w-screen overflow-hidden bg-black px-5 pb-16 pt-32 font-antonio text-white md:px-10">
	<div class="flex items-start justify-between gap-2 text-[clamp(4rem,11vw,10rem)] uppercase max-sm:text-[clamp(2.5rem,12vw,4rem)]">
		<h1 aria-label="References">
			<div aria-hidden="true">
				<TextReveal bind:this={title} text="References" textClass="leading-[1.04] tracking-normal" heightClass="h-[1.04em]" />
			</div>
		</h1>

		<p aria-label={`${total} references`}>
			<span aria-hidden="true">
				<TextReveal bind:this={count} text={String(total)} textClass="leading-[1.04] tracking-normal" heightClass="h-[1.04em]" />
			</span>
		</p>
	</div>

	<div class="rf-fade relative z-20 mt-10 flex flex-wrap items-center gap-x-3 gap-y-4 md:mt-12 md:flex-nowrap md:gap-4">
		<div class="order-1 shrink-0 rounded-full border border-white/80 px-5 py-2 text-xs uppercase sm:px-7 sm:text-sm">
			Filter
		</div>

		<button
			type="button"
			class="order-2 ml-auto shrink-0 cursor-pointer rounded-full bg-white px-4 py-2 text-xs uppercase text-black sm:px-6 sm:text-sm md:order-3 md:ml-0"
			onclick={() => {
				newestFirst = !newestFirst;

				const newIndex = years.findIndex((item) => item.year === selectedYear);

				if (newIndex !== -1) {
					sliderProgress = years.length > 1 ? newIndex / (years.length - 1) : 0;
				}
			}}
		>
			By Date {newestFirst ? '↓' : '↑'}
		</button>

		<div class="order-3 flex w-full min-w-0 items-center gap-2 md:order-2 md:w-auto md:flex-1 md:gap-4">
			<span class="shrink-0 text-sm md:text-lg">{startYear}</span>

			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				bind:this={track}
				class="relative h-10 min-w-0 flex-1 cursor-pointer touch-none"
				onpointerdown={startSliderDrag}
				onpointermove={dragSlider}
				onpointerup={endSliderDrag}
				onclick={clickSlider}
			>
				<div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/40"></div>

				<div
					class="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-white"
					style:width={`${sliderProgress * 100}%`}
				></div>

				<span
					class="absolute -top-7 -translate-x-1/2 text-sm"
					style:left={`${sliderProgress * 100}%`}
				>
					{sliderYear}
				</span>

				<div
					class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
					style:left={`${sliderProgress * 100}%`}
				>
					<div class={`rounded-full bg-white transition-[width,height] duration-200 ${draggingSlider ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'}`}></div>
				</div>
			</div>

			<span class="shrink-0 text-sm md:text-lg">{endYear}</span>
		</div>
	</div>

    	<!-- svelte-ignore a11y_no_static_element_interactions -->
    	<div
    		class="rf-gallery mt-2 relative cursor-none"
    		onmouseenter={handleSwiperContainerMouseEnter}
    		onmouseleave={handleSwiperContainerMouseExit}
    		onmousemove={moveCursor}
    		onpointerdown={() => pressCursor(true)}
    		onpointerup={() => pressCursor(false)}
    	>
    		{#key selectedYear}
    			<swiper-container use:gallery init="false" class="block w-full">
    				{#each galleryItems as item, index (item.path)}
    					<swiper-slide class="ref-slide" data-position={item.position} data-gap={item.gap}>
    						<figure class={`ref-card ref-card-${index}`}>
        						<button type="button" onclick={(event) => handleImgExpand(event, item, index)}>
            						<img
            							src={item.path}
            							alt={`ARQO reference project ${index + 1} — ${selectedYear}`}
            							loading={index === 0 ? 'eager' : 'lazy'}
            							fetchpriority={index === 0 ? 'high' : 'auto'}
            							decoding="async"
            							draggable="false"
            							class={`ref-img ref-img-${index} h-full w-full select-none object-cover`}
            							class:invisible={expandedProject?.path === item.path}
            						/>
            				    </button>
    						</figure>
    					</swiper-slide>
    				{/each}
    			</swiper-container>
    		{/key}

    		<div
    			bind:this={cursor}
				class="rf-cursor pointer-events-none absolute left-0 top-0 z-20 -ml-14 -mt-14 flex h-28 w-28 items-center justify-center rounded-full border border-white/80 text-sm uppercase"
    		>
    			Drag
    		</div>
    	</div>
    </main>


{#if expandedProject}
	<div
		bind:this={expandedLayer}
		class="expanded-layer fixed inset-0 z-[1000] grid place-items-center overflow-hidden px-6"
		role="dialog"
		aria-modal="true"
		aria-label={expandedProject.alt}
	>
		<div bind:this={expandedBackdrop} class="absolute inset-0 z-0 bg-black/65 backdrop-blur-xl"></div>
		<button
			type="button"
			class="absolute inset-0 z-0 cursor-default"
			aria-label="Close expanded project"
			onclick={closeImgExpand}
		></button>

		<div bind:this={expandedMarquee} class="project-marquee pointer-events-none absolute inset-x-0 top-[8%] z-0 overflow-hidden" aria-hidden="true">
			<div class="project-marquee-track font-antonio uppercase">
				<span>- ARCHITECTURE — PRECISION - LIGHT MATERIALS — ENGINEERED ENVELOPE SYSTEMS — </span>
				<span>- ARCHITECTURE — PRECISION - LIGHT MATERIALS — ENGINEERED ENVELOPE SYSTEMS — </span>
			</div>
		</div>

		<div bind:this={expandedCard} class="expanded-card absolute top-[10%] z-10 w-[min(84vw,38rem)]">

			<div class="relative flex h-[min(52vh,32rem)] w-full items-center justify-center overflow-visible">
				<img
					bind:this={expandedImage}
					src={expandedProject.fullPath}
					alt={expandedProject.alt}
					loading="eager"
					decoding="async"
					draggable="false"
					class="h-full w-full object-contain"
				/>
			</div>

			<dl class="expanded-details font-sans mt-2 text-center text-[13px] uppercase leading-tight text-white/90">
				<div class="grid grid-cols-[1fr_1fr] border-t border-white/25 py-2">
					<dt>Year</dt>
					<dd>{expandedProject.year}</dd>
				</div>
				<div class="grid grid-cols-[1fr_1fr] border-t border-white/25 py-2">
					<dt>Location</dt>
					<dd>{expandedProject.location}</dd>
				</div>
				<div class="grid grid-cols-[1fr_1fr] border-t border-white/25 py-2">
					<dt>Architect</dt>
					<dd>{expandedProject.architect}</dd>
				</div>
				<div class="grid grid-cols-[1fr_1fr] border-t border-white/25 py-2">
					<dt>Investor</dt>
					<dd>{expandedProject.investor}</dd>
				</div>
				<div class="grid grid-cols-[1fr_1fr] border-t border-white/25 py-2">
					<dt>Building type</dt>
					<dd>{expandedProject.buildingType}</dd>
				</div>
				<div class="grid grid-cols-[1fr_1fr] border-y border-white/25 py-2">
					<dt>Product type</dt>
					<dd>{expandedProject.productType}</dd>
				</div>
			</dl>
		</div>
	</div>
{/if}


<style>
	.rf-gallery swiper-container {
		display: block;
		width: 100%;
		height: 400px;
		overflow: visible;
	}

	.rf-gallery swiper-slide {
		display: block;
		width: 118px;
		height: 280px;
		flex-shrink: 0;
	}

	.rf-gallery swiper-slide[data-position='top'] {
		padding-top: 10px;
	}

	.rf-gallery swiper-slide[data-position='bottom'] {
		padding-top: 12rem;
	}

	.rf-gallery swiper-slide[data-gap='normal'] {
		margin-right: 6rem;
	}

	.rf-gallery swiper-slide[data-gap='large'] {
		margin-right: 15rem;
	}

	.ref-card {
		width: 12rem;
		height: 15rem;
		overflow: hidden;
		background: #111;
	}

	.ref-img {
		-webkit-user-drag: none;
		user-select: none;
	}

	.expanded-layer {
		opacity: 0;
		visibility: hidden;
	}


	.project-marquee-track {
		display: flex;
		width: max-content;
		white-space: nowrap;
		animation: arqo-marquee 28s linear infinite;
	}

	.project-marquee-track span {
		flex: none;
		padding-right: 1rem;
		color: rgb(255 255 255 / 35%);
		font-family: inherit;
		font-size: clamp(3rem, 11vw, 9rem);
		font-weight: 700;
		letter-spacing: -0.04em;
		line-height: 1;
		filter: blur(0.6px);
	}

	@keyframes arqo-marquee {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	@media (prefers-reduced-motion: reduce) {
		.project-marquee-track { animation: none; }
	}

	@media (max-width: 767px) {
		.rf-gallery swiper-container {
			height: 280px;
		}

		.rf-gallery swiper-slide {
			width: min(72vw, 16rem);
			height: 260px;
		}

		.rf-gallery swiper-slide[data-position='top'] {
			padding-top: 0;
		}

		.rf-gallery swiper-slide[data-position='bottom'] {
			padding-top: 2.5rem;
		}

		.rf-gallery swiper-slide[data-gap='normal'] {
			margin-right: 1rem;
		}

		.rf-gallery swiper-slide[data-gap='large'] {
			margin-right: 2.25rem;
		}

		.ref-card {
			width: 100%;
			height: 13rem;
		}

		.rf-cursor {
			display: none;
		}
	}

</style>
