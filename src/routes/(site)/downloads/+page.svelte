<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import TextReveal from '$lib/components/TextReveal.svelte';
	import { categories, downloadTabs, languages, type Doc } from '$lib/constants/downloadItems';

	gsap.registerPlugin(ScrollTrigger);

	let tabIndex = $state(1);
	let catId = $state(categories[0].id);
	let catsOpen = $state(false);
	let openId = $state<string | null>(null);
	let lang = $state(languages[0]);
	let langOpen = $state(false);

	const n = downloadTabs.length;
	const tab = $derived(downloadTabs[tabIndex]);
	const prevIndex = $derived((tabIndex - 1 + n) % n);
	const nextIndex = $derived((tabIndex + 1) % n);
	const activeCat = $derived(categories.find((c) => c.id === catId)!);
	const otherCats = $derived(categories.filter((c) => c.id !== catId));
	const docs = $derived(tab.docs[catId]);

	let root: HTMLElement;
	let langBox: HTMLElement;
	let heading: ReturnType<typeof TextReveal>;
	let busy = false;

	const fileFor = (d: Doc) => d.files[lang] ?? d.files[languages[0]];

	async function playHeading() {
		await tick();
		gsap.timeline().add(heading.reveal(1.2), 0).add(heading.swap(1.0), 1.35);
	}

	function animateContent(delay = 0) {
		gsap.fromTo(
			'.dl-fade, .dl-doc',
			{ opacity: 0, y: 24 },
			{ opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay }
		);
		gsap.fromTo('.dl-line', { attr: { x2: 0 } }, { attr: { x2: 100 } , duration: 1.4, ease: 'power3.inOut' });
	}

	onMount(() => {
		let cancelled = false;

		const ctx = gsap.context(() => {
			gsap.set('.dl-fade, .dl-doc', { opacity: 0 });
		}, root);

		document.fonts.ready.then(() => {
			if (cancelled) return;
			ctx.add(() => {
				gsap.to('.dl-line', { attr: { x2: 100 }, duration: 1.4, ease: 'power3.inOut' });
				playHeading();
				animateContent(0.9);
			});
		});

		return () => {
			cancelled = true;
			ctx.revert();
		};
	});

	function changeTab(i: number) {
		if (i === tabIndex || busy) return;
		busy = true;

		console.log("Changing tab.....")

		gsap.to('.dl-line', { attr: { x2: 0 }, duration: 0.5, ease: 'power3.out' });

		gsap.to('.dl-title-row', {
			opacity: 0,
			duration: 0.25,
			onComplete: async () => {
				tabIndex = i;
				catId = categories[0].id;
				catsOpen = false;
				openId = null;
				gsap.set('.dl-cats-more', { height: 0 });
				gsap.set('.dl-chev', { rotate: 0 });

				await tick();
				gsap.set('.dl-title-row', { opacity: 1 });
				playHeading();
				animateContent();
				busy = false;
			}
		});
	}

	function toggleCats(open = !catsOpen) {
		catsOpen = open;
		gsap.to('.dl-cats-more', { height: open ? 'auto' : 0, duration: 0.7, ease: 'power3.inOut', overwrite: 'auto' });
		gsap.to('.dl-chev', { rotate: open ? 180 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
		if (open) {
			gsap.fromTo(
				'.dl-cat-item',
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }
			);
		}
	}

	async function pickCat(id: string) {
		toggleCats(false);
		catId = id;
		openId = null;
		await tick();
		gsap.fromTo(
			'.dl-doc',
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
		);
	}

	function setBody(row: HTMLElement, open: boolean) {
		gsap.to(row.querySelector('.dl-body'), {
			height: open ? 'auto' : 0,
			duration: 0.7,
			ease: 'power3.inOut',
			overwrite: 'auto',
			onComplete: () => ScrollTrigger.refresh()
		});
		gsap.to(row.querySelector('.dl-body-text'), {
			opacity: open ? 1 : 0,
			y: open ? 0 : 16,
			duration: 0.6,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	}

	function toggleDoc(id: string) {
		const rows = gsap.utils.toArray<HTMLElement>('.dl-doc', root);
		const ids = docs.map((d) => d.id);

		if (openId) setBody(rows[ids.indexOf(openId)], false);
		if (openId === id) {
			openId = null;
			return;
		}
		setBody(rows[ids.indexOf(id)], true);
		openId = id;
	}
</script>

<svelte:head>
	<title>Downloads | ARQO</title>
</svelte:head>

<svelte:window
	onclick={(e) => {
		if (langOpen && !langBox.contains(e.target as Node)) langOpen = false;
	}}
/>

<main bind:this={root} class="min-h-screen w-screen overflow-hidden bg-black px-5 pb-24 pt-32 font-sans text-white md:px-10">
	<div class="dl-title-row relative mx-auto w-fit font-antonio text-[clamp(4rem,11vw,10rem)] uppercase">
		<button
			type="button"
			class="absolute right-full top-0 mr-[0.5em] hidden whitespace-nowrap leading-[1.04] text-white/30 transition-colors hover:text-white/60 md:block"
			onclick={() => changeTab(prevIndex)}
		>
			{downloadTabs[prevIndex].title}
		</button>

		{#key tab.id}
			<h1 aria-label={tab.title}>
				<div aria-hidden="true">
					<TextReveal
						bind:this={heading}
						text={tab.title}
						textClass="leading-[1.04] tracking-normal"
						heightClass="h-[1.1em]"
					/>
				</div>
			</h1>
		{/key}

		<button
			type="button"
			class="absolute left-full top-0 ml-[0.5em] hidden whitespace-nowrap leading-[1.04] text-white/30 transition-colors hover:text-white/60 md:block"
			onclick={() => changeTab(nextIndex)}
		>
			{downloadTabs[nextIndex].title}
		</button>
	</div>

	<div class="mt-6 flex justify-center gap-2 md:hidden">
		{#each downloadTabs as t, i (t.id)}
			<button
				type="button"
				class={`rounded-full border px-3 py-1 text-xs uppercase ${i === tabIndex ? 'bg-white text-black' : 'border-white/40 text-white/60'}`}
				onclick={() => changeTab(i)}
			>
				{t.title}
			</button>
		{/each}
	</div>

	<svg class="mt-16 block h-[3px] w-full md:mt-24" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
		<line class="dl-line" x1="0" y1="1" x2="0" y2="1" stroke="white" stroke-width="3" vector-effect="non-scaling-stroke" />
	</svg>

	<div class="grid grid-cols-1 gap-12 pt-10 md:grid-cols-2 md:gap-16">
		<div class="font-antonio text-white text-[clamp(2.5rem,5.5vw,5.5rem)] lowercase leading-none">
			<button
				type="button"
				class="dl-fade flex cursor-pointer items-center gap-4 text-left"
				aria-expanded={catsOpen}
				onclick={() => toggleCats()}
			>
				<span>{activeCat.label}</span>
				<svg class="dl-chev h-[0.5em] w-[0.5em] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 9l7 7 7-7" />
				</svg>
			</button>

			<div class="dl-cats-more overflow-hidden" style="height: 0">
				<ul class="flex flex-col pt-3">
					{#each otherCats as c (c.id)}
						<li class="dl-cat-item">
							<button
								type="button"
								class="cursor-pointer py-1 text-left text-white/40 transition-colors hover:text-white/80"
								onclick={() => pickCat(c.id)}
							>
								{c.label}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div>
			<div class="relative z-20 flex items-start justify-between gap-8">
				<p class="dl-fade max-w-lg text-sm leading-snug text-white/70">{tab.description}</p>

				<div bind:this={langBox} class="dl-fade relative shrink-0">
					<button
						type="button"
						class="cursor-pointer rounded-full border border-white/70 px-4 py-1 text-xs uppercase"
						aria-expanded={langOpen}
						onclick={() => (langOpen = !langOpen)}
					>
						{lang}
					</button>

					{#if langOpen}
						<ul transition:fly={{ y: -8, duration: 200 }} class="absolute right-0 top-full mt-2 flex flex-col gap-2">
							{#each languages as l (l)}
								<li>
									<button
										type="button"
										class={`w-full cursor-pointer rounded-full border border-white/70 px-4 py-1 text-xs uppercase transition-colors ${l === lang ? 'bg-white text-black' : 'bg-black hover:bg-white/15'}`}
										onclick={() => {
											lang = l;
											langOpen = false;
										}}
									>
										{l}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>

			<ul class="mt-16 border-b border-white/80">
				{#each docs as doc (doc.id)}
					<li class="dl-doc border-t border-white/80">
						<div class="flex items-center gap-4">
							<button
								type="button"
								class="flex-1 cursor-pointer py-4 text-left font-antonio text-xl uppercase"
								aria-expanded={openId === doc.id}
								onclick={() => toggleDoc(doc.id)}
							>
								{doc.title}
							</button>

							<a
								href={fileFor(doc)}
								download={`${doc.id}-${lang.toLowerCase()}.pdf`}
								class="flex shrink-0 items-center gap-2 rounded-full border border-white px-3 py-2 text-xs uppercase transition-colors duration-300 hover:bg-white hover:text-black"
							>
								<span class="hidden md:inline">Download</span>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 5v14m0 0l-6-6m6 6l6-6" />
								</svg>
							</a>
						</div>

						<div class="dl-body overflow-hidden" style="height: 0">
							<div class="dl-body-text pb-5 pr-4 text-sm leading-snug text-white/70" style="opacity: 0">
								<p>{doc.details}</p>
								<p class="mt-2 text-xs uppercase text-white/40">PDF · {doc.size} · {lang}</p>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</main>
