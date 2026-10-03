<script lang="ts">
	import navbarItems from '$lib/constants/navbarItems';
	import { Search, GlobeAlt } from '@boxicons/svelte';
</script>

<div
	class="navbar absolute z-100 flex h-13 w-[95%] origin-center scale-x-0 items-center justify-between rounded-lg bg-white p-3"
>

	<div class="navbar-logo flex cursor-pointer flex-col text-black -mt-2">
		<div class="top-part leading-none">
			<span class="text-xl">A</span>
			<span class="text-xl">R</span>
		</div>

		<div class="bottom-part leading-none -my-2.5">
			<span class="text-xl">Q</span>
			<span class="text-xl">O</span>
		</div>
	</div>

	<div class="navbar-items w-[70%]">
		<ul class="flex w-full items-center justify-between">
			{#each navbarItems as item(item)}
				<li class="navbar-item overflow-hidden text-xl tracking-wider cursor-pointer">
					<span class="navbar-item-text inline-block">{item}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="navbar-icons flex cursor-pointer items-center gap-3">
		<div class="navbar-icon overflow-hidden">
			<Search />
		</div>

		<div class="navbar-icon overflow-hidden">
			<GlobeAlt />
		</div>
	</div>
</div>
