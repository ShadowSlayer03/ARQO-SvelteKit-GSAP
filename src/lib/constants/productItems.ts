	type ProductSlide = {
		num: number;
		lines: string[];
		img: string;
		alt: string;
	};

const productItems = [
	{ name: 'AERIS', image: '/aeris.jpg', alt: 'Aeris - Attractive Roofing Solution' },
	{ name: 'VITRA', image: '/vitra.jpg', alt: 'Vitra - Versatile Glass Windows' },
	{ name: 'PRISM', image: '/prism.jpg', alt: 'Prism - Premium Reflective Panels' },
	{ name: 'SOLARIS', image: '/solaris.jpg', alt: 'Solaris - Solar Powered Louvre' },
	{ name: 'VECTOR', image: '/vector.jpg', alt: 'Vector - Directional Window Fins' }
];

const productSlides: ProductSlide[] = [
		{
			num: 1,
			lines: ['facades', 'and walls'],
			img: '/high-performance-envelope.jpg',
			alt: 'Modern facade with a geometric exterior wall system'
		},
		{
			num: 2,
			lines: ['roofing', 'solutions'],
			img: '/low-angle-roof.jpg',
			alt: 'Premium roofing solution'
		},
		{
			num: 3,
			lines: ['cladding', 'design'],
			img: '/architectural-cladding.jpg',
			alt: 'Contemporary building with refined architectural cladding'
		},
		{
			num: 4,
			lines: ['insulation', 'systems'],
			img: '/thermal-insulation.jpg',
			alt: 'High-performance thermal insulation integrated into a building envelope'
		},
		{
			num: 5,
			lines: ['shading', 'systems'],
			img: '/solar-shading.jpg',
			alt: 'Architectural solar shading system on a contemporary building'
		},
		{
			num: 6,
			lines: ['waterproof', 'solutions'],
			img: '/waterproofing.jpg',
			alt: 'Protective waterproofing system for a modern building'
		},
		{
			num: 7,
			lines: ['structural', 'systems'],
			img: '/structural-systems.jpg',
			alt: 'Precision-engineered structural components in contemporary architecture'
		},
		{
			num: 8,
			lines: ['custom', 'envelopes'],
			img: '/custom-envelopes.jpg',
			alt: 'Distinctive building envelope combining materiality and geometry'
		}
	];

const installationOptions = [
		{
			name: 'Horizontal',
			img: '/prism.jpg',
			alt: 'Geometric facade panels arranged in a horizontal rhythm',
			desc: 'Horizontal installation creates a clean, continuous rhythm across the facade. Panels align on a shared datum for a precise, streamlined finish.'
		},
		{
			name: 'Vertical',
			img: '/shading.jpg',
			alt: 'Vertical fins running across a modern building facade',
			desc: 'Vertical installation draws the eye upward. Fins stack on a single axis, emphasizing height while giving the facade a crisp, graphic cadence.'
		},
		{
			name: 'Staggered',
			img: '/shading1.jpg',
			alt: 'Staggered facade panels creating a stepped pattern',
			desc: 'Staggered installation offsets each panel by half a module. The resulting weave adds depth, shadow play and a distinct sense of movement.'
		},
		{
			name: 'Curved',
			img: '/shading2.jpg',
			alt: 'Curved facade panels wrapping around a building corner',
			desc: 'Curved installation follows the geometry of the building. Panels bend along the envelope for a fluid, sculptural finish that softens hard lines.'
		}
	];

export { productSlides, installationOptions };
export default productItems;
