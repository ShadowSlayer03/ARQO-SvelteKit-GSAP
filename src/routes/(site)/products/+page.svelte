<script lang="ts">
	import Hero from '$lib/sections/products/Hero.svelte';
	import ProductRange from '$lib/sections/products/ProductRange.svelte';
	import InstallationOptions from '$lib/sections/products/InstallationOptions.svelte';
</script>

<svelte:head>
	<title>Products — ARQO</title>
	<meta
		name="description"
		content="Explore ARQO's architectural envelope systems, engineered for performance and designed for modern buildings."
	/>
</svelte:head>

<main class="bg-black font-antonio text-white">
	<Hero />
	<ProductRange />
	<InstallationOptions />
</main>
