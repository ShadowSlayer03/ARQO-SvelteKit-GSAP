<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import serviceItems from '$lib/constants/serviceItems';
	import TextReveal from '$lib/components/TextReveal.svelte';

	gsap.registerPlugin(ScrollTrigger);

	let root: HTMLElement;
	let openIndex = -1;
	let titles: ReturnType<typeof TextReveal>[] = [];

	onMount(() => {
		let cancelled = false;

		// hidden states first, so nothing flashes before the timeline exists
		const ctx = gsap.context(() => {
			gsap.set('.svc-num, .svc-heading', { opacity: 0 });
			gsap.set('.svc-desc', { height: 0 });
			gsap.set('.svc-desc-text', { yPercent: 100 });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx.add(() => {
				const q = gsap.utils.selector(root);
				const lines = q('.svc-line');
				const nums = q('.svc-num');

				const tl = gsap.timeline({
					scrollTrigger: { trigger: root, start: 'top 70%', once: true }
				});

				tl.to('.svc-heading', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0);

				lines.forEach((line, i) => {
					const t = i * 0.3;
					tl.to(line, { attr: { x2: 100 }, duration: 1.4, ease: 'power3.inOut' }, t);

					if (titles[i]) {
						tl.add(titles[i].reveal(1.2), t + 0.35);
						tl.add(titles[i].swap(1.0), t + 0.35 + 1.2 + 0.15);
						tl.to(nums[i], { opacity: 1, duration: 0.8, ease: 'power2.out' }, t + 0.35);
					}
				});

				ScrollTrigger.refresh();
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});

	function setRow(row: HTMLElement, open: boolean) {
		const q = gsap.utils.selector(row);

		gsap.to(q('.svc-desc'), {
			height: open ? 'auto' : 0,
			duration: 0.8,
			ease: 'power3.inOut',
			overwrite: 'auto',
			onComplete: () => ScrollTrigger.refresh()
		});
		gsap.to(q('.svc-desc-text'), {
			yPercent: open ? 0 : 100,
			duration: 0.8,
			ease: 'power3.out',
			overwrite: 'auto'
		});
		gsap.to(q('.svc-icon'), {
			rotate: open ? 45 : 0,
			duration: 0.5,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	}

	function toggle(i: number) {
		const rows = gsap.utils.toArray<HTMLElement>('.svc-row', root);

		if (openIndex === i) {
			setRow(rows[i], false);
			openIndex = -1;
			return;
		}

		if (openIndex !== -1) setRow(rows[openIndex], false);
		setRow(rows[i], true);
		openIndex = i;
	}
</script>

<section
	bind:this={root}
	class="min-h-screen w-screen bg-black px-5 pt-10 font-antonio text-white md:px-10 md:pt-30"
>
	<h5 class="svc-heading mb-10 text-lg uppercase">Solutions &amp; Services</h5>

	{#each serviceItems as service, i (service.title)}
		<div class="svc-row">
			<svg class="block h-[2px] w-full" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
				<line
					class="svc-line"
					x1="0"
					y1="1"
					x2="0"
					y2="1"
					stroke="white"
					stroke-width="2"
					vector-effect="non-scaling-stroke"
				/>
			</svg>

			<button
				type="button"
				class="flex w-full cursor-pointer items-start text-left"
				aria-expanded={false}
				aria-controls={`svc-desc-${i}`}
				onclick={() => toggle(i)}
			>
				<span class="svc-num w-[12%] pt-2 font-sans text-sm md:w-[15%]">
					{String(i + 1).padStart(2, '0')}.
				</span>

				<div class="flex-1 text-[clamp(2.5rem,8vw,8rem)] uppercase">
					<TextReveal
						bind:this={titles[i]}
						text={service.title}
						textClass="leading-[1.1]"
						heightClass="h-[1em]"
					/>
				</div>

				<span class="svc-icon pr-2 pt-2 font-sans text-4xl leading-none">+</span>
			</button>

			<div id={`svc-desc-${i}`} class="svc-desc overflow-hidden">
				<div class="svc-desc-text flex">
					<div class="w-[12%] md:w-[15%]"></div>
					<p class="max-w-xl pt-2 pb-8 font-sans text-base leading-snug text-white/70">
						{service.description}
					</p>
				</div>
			</div>
		</div>
	{/each}

	<svg class="block h-0.5 w-full" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
		<line class="svc-line" x1="0" y1="1" x2="0" y2="1" stroke="white" stroke-width="2" vector-effect="non-scaling-stroke" />
	</svg>
</section>
