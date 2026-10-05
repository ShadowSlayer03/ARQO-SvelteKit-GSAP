<script>
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	const seo = $derived($page.data.seo ?? {});
	const title = $derived(seo.title ?? 'ARQO | Building Enclosure Solutions');
	const description = $derived(
		seo.description ??
			'ARQO specializes in premium building envelope systems — facades, cladding, glazing, and insulation for modern architecture.'
	);
	const ogImage = $derived(seo.ogImage ?? 'https://arqo.com/og-default.jpg');
	const canonical = $derived(seo.canonical ?? 'https://arqo.com');

	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: 'ARQO',
		description:
			'Premium building envelope systems — facades, cladding, glazing, and insulation for modern architecture.',
		url: 'https://arqo.vercel.app',
		telephone: '+1-555-ARQO-INC',
		areaServed: 'Worldwide',
		sameAs: ['https://linkedin.com/company/arqo']
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content="ARQO" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

{@render children()}
