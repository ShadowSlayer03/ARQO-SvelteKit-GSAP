<script lang="ts">
	import gsap from 'gsap';

	const { topic } = $props();

	let root: HTMLElement;

	function onMouseEnter() {
		const img = root.querySelector('.img-container');
		const text = root.querySelector('.text-container');

		gsap.to(img, {
			y: -80,
			rotate: 5,
			duration: 1,
			ease: 'power2.out'
		});

		gsap.to(text, {
		    backgroundColor: "white",
			color: "black",
			rotate: -10,
			y: 40,
			duration: 1,
			ease: 'power2.out'
		});
	}

	function onMouseLeave() {
     	const img = root.querySelector('.img-container');
     	const text = root.querySelector('.text-container');

		gsap.to(img, {
			y: 0,
			rotate: 0,
			duration: 1,
			ease: 'power2.out'
		});

		gsap.to(text, {
    		backgroundColor: "black",
    		color: "white",
			rotate: 0,
			y: 0,
			duration: 1,
			ease: 'power2.out'
		});
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={root}
	class="relative h-100 w-80 shrink-0"
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
>
	<div class="img-container absolute inset-0 z-0 overflow-hidden rounded-lg border border-white/30">
		<img class="h-full w-full object-cover" src={topic.image} alt={topic.alt} />
	</div>

	<div class="text-container absolute inset-0 z-10 flex flex-col justify-between rounded-lg border border-white bg-black p-5 text-white">
		<div class="header font-singo-sans">
			<h3 class="text-left text-[2rem] leading-none tracking-wide">{topic.title}</h3>
			<p class="text-left">{topic.date}</p>
		</div>

		<div class="description font-antonio">{topic.description}</div>
	</div>
</div>
