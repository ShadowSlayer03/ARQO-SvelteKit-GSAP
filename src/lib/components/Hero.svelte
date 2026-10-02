<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let root: HTMLDivElement;

	onMount(() => {
		const ctx = gsap.context(() => {




		}, root);

		return () => ctx.revert();
	});
</script>

<div bind:this={root} class="h-screen w-screen bg-black p-4 md:p-6 font-singo-sans">
	<div class="relative h-full w-full">

    	<div
    		class="first-circle pointer-events-none absolute left-1/3 -top-32 z-[60] h-64 w-64 overflow-hidden rounded-full bg-fuchsia-400 will-change-transform"
    	>
    		<img
    			src="/low-angle-roof.jpg"
    			alt="Low angle roof"
    			class="hero-image h-full w-full object-cover [clip-path:inset(25%_25%_25%_25%)] scale-200"
    		/>
	    </div>

		<div
				class="second-circle pointer-events-none absolute left-1/2 top-[40%] z-[60] h-64 w-64 overflow-hidden rounded-full bg-blue-300 will-change-transform"
			>
			<img
    			src="/louvers-shading.jpg"
    			alt="Louvers for shading"
    			class="hero-image h-full w-full object-cover [clip-path:inset(25%_25%_25%_25%)] scale-200"
    		/>

		</div>

		<div class="third-circle final-dot pointer-events-none absolute left-1/2 top-1/2 z-[60] h-64 w-64 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-500 will-change-transform">
        <img
            src="/modern-glass-building.jpg"
            alt="Hero background"
            class="hero-image h-full w-full object-cover [clip-path:inset(25%_25%_25%_25%)] scale-200"
            />
		</div>
	</div>
</div>
