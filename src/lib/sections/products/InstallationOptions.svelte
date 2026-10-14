<script lang="ts">
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import WordReveal from '$lib/components/WordReveal.svelte';
	import { installationOptions } from '$lib/constants/productItems';

	gsap.registerPlugin(ScrollTrigger);

	let installationSection: HTMLElement;
	let installationPanel: HTMLDivElement;
	let installationFrame: HTMLElement;
	let installationImageA: HTMLImageElement;
	let installationImageB: HTMLImageElement;
	let installationCaption: HTMLElement | undefined;
	let optionMenu: HTMLDivElement;
	let optionTrigger: HTMLButtonElement;

	let selectedOption = $state(0);
	let menuOpen = $state(false);
	let switching = $state(false);
	let activeImageLayer = $state(0);
	let incomingImageLayer = $state(1);
	let staggeredImageLayer = $state(1);
	let installationImageIndices = $state([0, 0]);
	const preloadedImages = new Map<string, Promise<void>>();

	function preloadInstallationImage(src: string) {
		const existing = preloadedImages.get(src);
		if (existing) return existing;

		const image = new Image();
		image.src = src;
		const ready = image.decode().catch(() => {});
		preloadedImages.set(src, ready);
		return ready;
	}

	function toggleMenu() {
		if (menuOpen) {
			closeMenu();
			return;
		}

		menuOpen = true;

		gsap
			.timeline()
			.to(optionMenu, { autoAlpha: 1, duration: 0.01 }, 0)
			.fromTo(
				optionMenu,
				{ clipPath: 'inset(0% 0% 100% 0%)' },
				{ clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut' },
				0
			)
			.fromTo(
				optionMenu.querySelectorAll<HTMLElement>('.option-item'),
				{ y: '110%' },
				{ y: '0%', duration: 0.7, ease: 'power4.out', stagger: 0.07 },
				0.15
			);
	}

	function closeMenu() {
		if (!menuOpen) return;

		menuOpen = false;
		gsap.to(optionMenu, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
	}

	function handleOutsideClick(event: PointerEvent) {
		if (!menuOpen) return;

		const target = event.target as Node;
		if (optionMenu.contains(target) || optionTrigger.contains(target)) return;

		closeMenu();
	}

	async function selectOption(index: number) {
		closeMenu();

		if (switching || index === selectedOption) return;
		switching = true;
		await preloadInstallationImage(installationOptions[index].img);

		const nextLayer = 1 - activeImageLayer;
		const incomingImage = nextLayer === 0 ? installationImageA : installationImageB;
		const outgoingImage = activeImageLayer === 0 ? installationImageA : installationImageB;

		incomingImageLayer = nextLayer;
		staggeredImageLayer = nextLayer;
		installationImageIndices = installationImageIndices.map((optionIndex, layer) =>
			layer === nextLayer ? index : optionIndex
		);
		selectedOption = index;
		await tick();
		await incomingImage.decode().catch(() => {});
		const staggeredSlices = Array.from(
			installationFrame.querySelectorAll<HTMLImageElement>('.staggered-slice')
		);
		if (index === 2) {
			await Promise.all(staggeredSlices.map((slice) => slice.decode().catch(() => {})));
		}

		const timeline = gsap.timeline({
			onComplete: () => {
				activeImageLayer = nextLayer;
				gsap.set(outgoingImage, { autoAlpha: 0, clearProps: 'clipPath,transform' });
				gsap.set(incomingImage, { autoAlpha: 1, clearProps: 'clipPath,transform' });
				if (index === 2) gsap.set(staggeredSlices, { autoAlpha: 0, clearProps: 'transform' });
				switching = false;
			}
		});

		timeline
			.to('.installation-desc', { autoAlpha: 0, y: 6, duration: 0.2, ease: 'power2.in' }, 0)
			.fromTo(
				'.installation-desc',
				{ autoAlpha: 0, y: 8 },
				{ autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
				0.38
			);

		if (installationCaption) {
			timeline
				.to(installationCaption, { autoAlpha: 0, y: 6, duration: 0.2, ease: 'power2.in' }, 0)
				.fromTo(
					installationCaption,
					{ autoAlpha: 0, y: 8 },
					{ autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' },
					0.38
				);
		}

		if (index === 0) {
			gsap.set(outgoingImage, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
			gsap.set(incomingImage, {
				autoAlpha: 1,
				scale: 1.2,
				clipPath: 'inset(0% 100% 0% 0%)'
			});
			timeline
				.to(
					outgoingImage,
					{
						xPercent: 22,
						clipPath: 'inset(0% 0% 0% 100%)',
						duration: 0.9,
						ease: 'power3.inOut'
					},
					0
				)
				.to(
					incomingImage,
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' },
					0
				)
				.to(incomingImage, { scale: 1, duration: 0.9, ease: 'power3.out' }, 0);
		} else if (index === 1) {
			gsap.set(outgoingImage, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
			gsap.set(incomingImage, {
				autoAlpha: 1,
				scale: 1.2,
				clipPath: 'inset(100% 0% 0% 0%)'
			});
			timeline
				.to(
					outgoingImage,
					{
						yPercent: 20,
						clipPath: 'inset(0% 0% 100% 0%)',
						duration: 0.9,
						ease: 'power3.inOut'
					},
					0
				)
				.to(
					incomingImage,
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' },
					0
				)
				.to(incomingImage, { scale: 1, duration: 0.9, ease: 'power3.out' }, 0);
		} else if (index === 2) {
			gsap.set(outgoingImage, { autoAlpha: 1 });
			gsap.set(incomingImage, { autoAlpha: 0, scale: 1.2 });
			gsap.set(staggeredSlices, {
				autoAlpha: 1,
				scale: 1.08,
				xPercent: (sliceIndex) => (sliceIndex % 2 === 0 ? 100 : -100)
			});
			timeline
				.to(
					outgoingImage,
					{ xPercent: -8, autoAlpha: 0, scale: 1.04, duration: 0.7, ease: 'power3.inOut' },
					0
				)
				.to(
					staggeredSlices,
					{
						xPercent: 0,
						scale: 1,
						duration: 0.78,
						ease: 'power3.out',
						stagger: { each: 0.1, from: 'start' }
					},
					0
				);
		} else {
			gsap.set(incomingImage, {
				autoAlpha: 1,
				scale: 1.2,
				clipPath: 'circle(0% at 100% 50%)'
			});
			timeline
				.to(
					outgoingImage,
					{ xPercent: -8, autoAlpha: 0, scale: 1.04, duration: 0.7, ease: 'power2.inOut' },
					0
				)
				.to(
					incomingImage,
					{ clipPath: 'circle(160% at 100% 50%)', duration: 0.95, ease: 'power3.inOut' },
					0
				)
				.to(incomingImage, { scale: 1, duration: 1.05, ease: 'power3.out' }, 0);
		}
	}

	onMount(() => {
		let cancelled = false;

		installationOptions.forEach(({ img }) => preloadInstallationImage(img));

		const ctx = gsap.context(() => {
			gsap.set('.installation-copy', { autoAlpha: 0, y: 24 });
			gsap.set(installationPanel, { width: '94%', minHeight: '90svh', maxWidth: '72rem' });
			gsap.set(installationFrame, { clipPath: 'inset(0% 0% 100% 0%)' });
			gsap.set(installationImageA, { scale: 1.2, autoAlpha: 1 });
			gsap.set(installationImageB, { scale: 1.2, autoAlpha: 0 });
			gsap.set('.staggered-slice', { autoAlpha: 0 });
			gsap.set(optionMenu, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' });
		}, installationSection);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				ScrollTrigger.create({
					trigger: installationSection,
					start: 'top 62%',
					once: true,
					onEnter: () => {
						gsap
							.timeline()
							.to(
								installationPanel,
								{
									width: '100%',
									minHeight: '100svh',
									maxWidth: '100%',
									duration: 1.2,
									ease: 'power3.inOut'
								},
								0
							)
							.to(
								'.installation-copy',
								{ autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 },
								0
							)
							.to(
								installationFrame,
								{ clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' },
								0
							)
							.to(installationImageA, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0);
					}
				});
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});
</script>

<svelte:window onpointerdown={handleOutsideClick} />

<section
	bind:this={installationSection}
	id="installation-options"
	class="min-h-screen bg-white"
	aria-labelledby="installation-heading"
>
	<div
		bind:this={installationPanel}
		class="mx-auto flex min-h-[90svh] w-[94%] max-w-6xl items-center bg-black p-6 md:p-10"
	>
		<div class="grid w-full gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-14">
			<div class="flex flex-col items-start">
				<h2 id="installation-heading" class="mb-5">
					<WordReveal
						lines={['installation', 'options']}
						textClass="font-antonio text-[clamp(3rem,6vw,7rem)] tracking-[-0.05em]"
						size="1.3em"
					/>
				</h2>

				<p
					class="installation-desc installation-copy max-w-sm font-sans text-xs leading-relaxed text-white/70"
				>
					{installationOptions[selectedOption].desc}
				</p>

				<a
					href="/downloads"
					class="installation-copy mt-5 font-sans text-[10px] uppercase underline underline-offset-4"
				>
					View all installation options
				</a>

				<div class="installation-copy relative mt-10 w-full max-w-[14rem]">
					<button
						bind:this={optionTrigger}
						type="button"
						onclick={toggleMenu}
						aria-expanded={menuOpen}
						aria-haspopup="listbox"
						class="group text-md flex w-full items-center justify-between border border-white/60 px-4 py-3 font-antonio uppercase transition-colors duration-700 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
					>
						<span>{installationOptions[selectedOption].name}</span>
						<span
							class="transition-transform duration-500 {menuOpen
								? '-rotate-90'
								: 'group-hover:translate-x-2'}"
							aria-hidden="true"
						>
							→
						</span>
					</button>

					<div
						bind:this={optionMenu}
						class="absolute bottom-full left-0 z-30 mb-3 w-full border border-white/60 bg-black"
					>
						<p
							class="border-b border-white/40 px-4 py-3 font-sans text-[10px] tracking-[0.16em] text-white/60 uppercase"
						>
							Installation style
						</p>
						<ul role="listbox" aria-label="Installation style">
							{#each installationOptions as option, i (option.name)}
								<li class="overflow-hidden">
									<button
										type="button"
										role="option"
										aria-selected={i === selectedOption}
										onclick={() => selectOption(i)}
										class="option-item group text-md flex w-full cursor-none items-center justify-between px-4 py-3 font-antonio uppercase transition-colors duration-300 {i ===
										selectedOption
											? 'bg-white/15'
											: 'hover:bg-white hover:text-black'}"
									>
										<span>{option.name}</span>
										<span class="font-sans text-[10px] tracking-[0.18em]" aria-hidden="true">
											0{i + 1}
										</span>
									</button>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			<figure bind:this={installationFrame} class="relative aspect-[4/3] overflow-hidden">
				<img
					bind:this={installationImageA}
					src={installationOptions[installationImageIndices[0]].img}
					alt={installationOptions[installationImageIndices[0]].alt}
					aria-hidden={activeImageLayer !== 0}
					style:z-index={incomingImageLayer === 0 ? 2 : 1}
					loading="lazy"
					decoding="async"
					class="absolute inset-0 h-full w-full object-cover"
				/>
				<img
					bind:this={installationImageB}
					src={installationOptions[installationImageIndices[1]].img}
					alt={installationOptions[installationImageIndices[1]].alt}
					aria-hidden={activeImageLayer !== 1}
					style:z-index={incomingImageLayer === 1 ? 2 : 1}
					loading="lazy"
					decoding="async"
					class="absolute inset-0 h-full w-full object-cover"
				/>
				<img
					src={installationOptions[installationImageIndices[staggeredImageLayer]].img}
					alt=""
					aria-hidden="true"
					loading="eager"
					decoding="async"
					style:z-index={3}
					style:clip-path="inset(0% 0% 75% 0%)"
					class="staggered-slice pointer-events-none absolute inset-0 h-full w-full object-cover"
				/>
				<img
					src={installationOptions[installationImageIndices[staggeredImageLayer]].img}
					alt=""
					aria-hidden="true"
					loading="eager"
					decoding="async"
					style:z-index={3}
					style:clip-path="inset(25% 0% 50% 0%)"
					class="staggered-slice pointer-events-none absolute inset-0 h-full w-full object-cover"
				/>
				<img
					src={installationOptions[installationImageIndices[staggeredImageLayer]].img}
					alt=""
					aria-hidden="true"
					loading="eager"
					decoding="async"
					style:z-index={3}
					style:clip-path="inset(50% 0% 25% 0%)"
					class="staggered-slice pointer-events-none absolute inset-0 h-full w-full object-cover"
				/>
				<img
					src={installationOptions[installationImageIndices[staggeredImageLayer]].img}
					alt=""
					aria-hidden="true"
					loading="eager"
					decoding="async"
					style:z-index={3}
					style:clip-path="inset(75% 0% 0% 0%)"
					class="staggered-slice pointer-events-none absolute inset-0 h-full w-full object-cover"
				/>
			</figure>
		</div>
	</div>
</section>
