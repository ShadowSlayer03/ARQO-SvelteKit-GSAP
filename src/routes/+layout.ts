import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	return {
		seo: {
			title: 'ARQO | Building Enclosure Solutions',
			description:
				'ARQO specializes in premium building envelope systems — facades, cladding, glazing, and insulation for modern architecture.',
			ogImage: 'https://arqo-arj.vercel.app/og-default.jpg',
			canonical: 'https://arqo-arj.vercel.app'
		}
	};
};
