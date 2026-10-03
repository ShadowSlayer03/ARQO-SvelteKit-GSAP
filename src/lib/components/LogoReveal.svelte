<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let {
	animationState = $bindable()
	} = $props();

	onMount(() => {
		const tl = gsap.timeline({
			defaults: {
				duration: 1.2,
				ease: 'power4.inOut'
			}
		});

		gsap.set('.move-up-one, .move-up-two', { y: '100%' });
		gsap.set('.move-down-one, .move-down-two', { y: '-200%' });

		tl
		    .to('.move-up-one', { y: 0 }, 0)
		    .to('.move-up-two', { y: 0 }, 0)
		    .to('.move-down-one', { y: '-100%' }, 0)
		    .to('.move-down-two', { y: '-100%' }, 0)

		gsap.delayedCall(1.5, () => {
			const tl2 = gsap.timeline({
				defaults: {
					duration: 1.2,
					ease: 'power4.inOut'
				},
				onComplete: ()=>{
				    animationState = "loaded";
				}
			});

			tl2
			.to('.move-up-one', { y: '-100%' }, 0)
            .to('.move-up-two', { y: '-100%' }, 0)
            .to('.move-down-one', { y: 0 }, 0)
		    .to('.move-down-two', { y: 0 }, 0)

		});
	});
</script>

<div class="relative flex h-screen w-screen bg-black font-singo-sans">
	<div
		class="logo-container absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 text-white"
	>
		<div class="top-logo-part flex h-32 overflow-hidden">
			<div class="a-div flex flex-col">
				<span class="move-up-one text-[8.5rem] leading-none">A</span>
				<span class="move-up-two text-[8.5rem] leading-none">A</span>
			</div>

			<div class="r-div flex flex-col leading-none ">
				<span class="move-down-one text-[8.5rem]">R</span>
				<span class="move-down-two text-[8.5rem]">R</span>
			</div>
		</div>

		<div class="bottom-logo-part flex h-32 overflow-hidden">
			<div class="q-div flex flex-col leading-none">
				<span class="move-up-one text-[8.5rem]">Q</span>
				<span class="move-up-two text-[8.5rem]">Q</span>
			</div>

			<div class="o-div flex flex-col leading-none">
				<span class="move-down-one text-[8.5rem]">O</span>
				<span class="move-down-two text-[8.5rem]">O</span>
			</div>
		</div>
	</div>
</div>
