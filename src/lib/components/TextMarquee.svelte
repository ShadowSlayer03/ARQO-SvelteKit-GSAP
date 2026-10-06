<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<div
	class="marquee-text flex w-max justify-between gap-20 overflow-visible font-antonio text-9xl tracking-wide text-white"
>
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
</div>
