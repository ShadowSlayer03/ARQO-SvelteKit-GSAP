<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let root: HTMLDivElement;

	onMount(() => {
		const moveCursor = (event: MouseEvent) => {
			gsap.to(root, {
				x: event.clientX,
				y: event.clientY,
				duration: 0.15,
				ease: 'power3.out'
			});
		};

		document.addEventListener('mousemove', moveCursor);

		return () => {
			document.removeEventListener('mousemove', moveCursor);
		};
	});
</script>

<div
	bind:this={root}
	class="mouse-pointer pointer-events-none fixed top-0 left-0 z-[9999] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
></div>
