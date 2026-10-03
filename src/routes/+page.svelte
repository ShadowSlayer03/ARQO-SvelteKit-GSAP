<script lang="ts">
	import LoaderZoom from "$lib/components/LoaderZoom.svelte";
	import LogoReveal from "$lib/components/LogoReveal.svelte";
	import Hero from "../lib/components/Hero.svelte";

    let animationState : 'init' | 'loaded' | 'completed' = $state('init');


</script>

<!-- Architecture. Research. Quality. Originality. -->
{#if animationState === "init"}
    <LogoReveal bind:animationState />
{:else if animationState === "loaded"}
    <LoaderZoom bind:animationState />
{:else}
    <Hero />
{/if}
