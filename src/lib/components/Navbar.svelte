<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import gsap from 'gsap';
	import navbarItems from '$lib/constants/navbarItems';
	import { Search, GlobeAlt } from '@boxicons/svelte';

	let root: HTMLElement;
	let q: ReturnType<typeof gsap.utils.selector>;
	let ctx: gsap.Context;
	let mobileMenuOpen = $state(false);

	onMount(() => {
		q = gsap.utils.selector(root);

		ctx = gsap.context(() => {
			gsap.set(root, { scaleX: 0, autoAlpha: 1 });
			gsap.set(q('.navbar-logo, .navbar-item-text, .navbar-icon'), {
				yPercent: 120,
				opacity: 0
			});
		}, root);

		return () => ctx.revert();
	});

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleOutsidePointerdown(event: PointerEvent) {
		if (!mobileMenuOpen || root.contains(event.target as Node)) return;
		closeMobileMenu();
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeMobileMenu();
	}

	export function showImmediately() {
		gsap.killTweensOf(root);
		gsap.killTweensOf(q('.navbar-logo, .navbar-item-text, .navbar-icon'));
		gsap.set(root, { scaleX: 1, autoAlpha: 1 });
		gsap.set(q('.navbar-logo, .navbar-item-text, .navbar-icon'), {
			yPercent: 0,
			opacity: 1
		});
	}

	export function reveal(duration = 2.2) {
		const tl = gsap.timeline();

		tl.to(root, { scaleX: 1, duration, ease: 'power4.inOut' }, 0);

		tl.to(
			q('.navbar-item-text'),
			{
				yPercent: 0,
				opacity: 1,
				duration: 1,
				ease: 'power4.out',
				stagger: { each: 0.12, from: 'center' }
			},
			duration * 0.7
		);

		tl.to(
			q('.navbar-logo, .navbar-icon'),
			{
				yPercent: 0,
				opacity: 1,
				duration: 1,
				ease: 'power4.out',
				stagger: 0.08
			},
			duration * 0.8
		);

		return tl;
	}
</script>

<svelte:window onpointerdown={handleOutsidePointerdown} onkeydown={handleWindowKeydown} />

<div class="pointer-events-none fixed inset-x-0 top-4 z-9998 flex justify-center md:top-6">
	<nav
		bind:this={root}
		class="navbar pointer-events-auto invisible relative flex h-13 w-[95%] origin-center items-center justify-between rounded-lg bg-white p-3 font-antonio"
	>
		<a
			href="/"
			onclick={closeMobileMenu}
			class="navbar-logo -mt-2 flex cursor-pointer flex-col font-singo-sans text-black"
		>
			<div class="top-part leading-none">
				<span class="text-xl">A</span>
				<span class="text-xl">R</span>
			</div>
			<div class="bottom-part -my-2.5 leading-none">
				<span class="text-xl">Q</span>
				<span class="text-xl">O</span>
			</div>
		</a>

		<div class="navbar-items hidden w-[70%] md:block">
			<ul class="flex w-full items-center justify-between">
				{#each navbarItems as item (item)}
					<a
						href={item.href}
						class="navbar-item cursor-pointer overflow-hidden text-base tracking-wider lg:text-xl"
					>
						<span class="navbar-item-text inline-block uppercase">{item.label}</span>
					</a>
				{/each}
			</ul>
		</div>

		<div class="navbar-icons flex items-center gap-2 sm:gap-3">
			<div class="navbar-icon cursor-pointer overflow-hidden" aria-label="Search"><Search /></div>
			<div class="navbar-icon hidden cursor-pointer overflow-hidden sm:block" aria-label="Language">
				<GlobeAlt />
			</div>
			<button
				type="button"
				class="navbar-icon relative h-9 w-9 cursor-pointer md:hidden"
				aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-navbar-menu"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				<span
					aria-hidden="true"
					class="pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-5 rounded-full bg-black transition-transform duration-200"
					style:transform={mobileMenuOpen
						? 'translate(-50%, -50%) rotate(45deg)'
						: 'translate(-50%, calc(-50% - 6px))'}
				></span>
				<span
					aria-hidden="true"
					class="pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-opacity duration-200"
					class:opacity-0={mobileMenuOpen}
				></span>
				<span
					aria-hidden="true"
					class="pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-5 rounded-full bg-black transition-transform duration-200"
					style:transform={mobileMenuOpen
						? 'translate(-50%, -50%) rotate(-45deg)'
						: 'translate(-50%, calc(-50% + 6px))'}
				></span>
			</button>
		</div>

		{#if mobileMenuOpen}
			<div
				id="mobile-navbar-menu"
				transition:fly={{ y: -8, duration: 220 }}
				class="absolute top-full left-0 z-50 mt-2 w-full rounded-lg bg-white p-3 text-black shadow-xl md:hidden"
			>
				<ul class="flex flex-col">
					{#each navbarItems as item (item)}
						<li>
							<a
								href={item.href}
								onclick={closeMobileMenu}
								class="block border-b border-black/10 px-3 py-3 font-antonio text-xl tracking-wider uppercase last:border-0"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</nav>
</div>
