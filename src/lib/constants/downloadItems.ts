export const languages = ['EN', 'DE', 'FR', 'DA'];

export const categories = [
	{ id: 'facade-systems', label: 'facade systems' },
	{ id: 'modular-space', label: 'modular space' },
	{ id: 'portfolio', label: 'portfolio' }
];

export type Doc = {
	id: string;
	title: string;
	details: string;
	size: string;
	files: Record<string, string>; // language -> file path (put the PDFs in /static/downloads/<lang>/)
};

const doc = (slug: string, title: string, details: string, size = '3.2 MB'): Doc => ({
	id: slug,
	title,
	details,
	size,
	files: Object.fromEntries(languages.map((l) => [l, `/downloads/${l.toLowerCase()}/${slug}.pdf`]))
});

export const downloadTabs: {
	id: string;
	title: string;
	description: string;
	docs: Record<string, Doc[]>;
}[] = [
	{
		id: 'case-studies',
		title: 'Case Studies',
		description:
			'Real projects, told from brief to handover. Each case study shows the challenge, the system we engineered and the measured results, from energy performance to installation time.',
		docs: {
			'facade-systems': [
				doc('waterfront-tower', 'Copenhagen Waterfront Tower', 'A ventilated aluminium facade that cut cooling loads on a 22-storey office tower.', '5.1 MB'),
				doc('aarhus-cultural-centre', 'Aarhus Cultural Centre', 'Curved cladding panels delivered and installed in 14 weeks.', '4.4 MB'),
				doc('harbour-offices', 'Harbour Offices Refurbishment', 'Re-cladding an occupied building without interrupting operations.', '3.8 MB')
			],
			'modular-space': [
				doc('modular-school', 'Modular School Extension', 'Eight classrooms built off-site and craned in over one summer holiday.', '4.9 MB'),
				doc('pop-up-clinic', 'Pop-up Clinic', 'A fully fitted healthcare unit, operational six weeks after the order.', '3.5 MB')
			],
			portfolio: [
				doc('portfolio-2026-cases', 'Selected Projects 2026', 'Twelve recent projects across Europe, with key figures for each.', '9.7 MB'),
				doc('awards-recognition', 'Awards & Recognition', 'Industry awards and the projects behind them.', '2.2 MB')
			]
		}
	},
	{
		id: 'brochures',
		title: 'Brochures',
		description:
			'Our product brochures offer detailed presentations, applications and technical specifications. Ideal for architects and builders, they give insight into product versatility and installation requirements, with clear and transparent documentation.',
		docs: {
			'facade-systems': [
				doc('facade-overview', 'ARQO Facade Systems Overview', 'The complete range of ventilated, rainscreen and insulated facade systems.', '6.3 MB'),
				doc('ventilated-panels', 'Ventilated Facade Panels', 'Panel types, finishes, fixing methods and typical build-ups.', '4.1 MB'),
				doc('fireproof-panels', 'Fireproof Cladding Panels Brochure', 'Fire-rated panels with classification and approved applications.', '3.7 MB'),
				doc('curtain-wall', 'Curtain Wall Systems', 'Unitised and stick-built glazing systems for high-rise projects.', '5.0 MB')
			],
			'modular-space': [
				doc('modular-overview', 'Modular Building Overview', 'How off-site construction shortens programmes and reduces waste.', '4.6 MB'),
				doc('wall-modules', 'Prefabricated Wall Modules', 'Insulated wall modules for fast, weather-tight enclosure.', '3.3 MB')
			],
			portfolio: [
				doc('company-profile', 'Company Profile', 'Who we are, what we make and where we work.', '2.8 MB'),
				doc('sustainability-report', 'Sustainability Report', 'Our carbon targets, materials policy and progress to date.', '3.9 MB')
			]
		}
	},
	{
		id: 'specifications',
		title: 'Specifications',
		description:
			'Technical data for engineers and specifiers: performance tables, structural values, fire classifications and installation guidance, kept in one place and updated with every product revision.',
		docs: {
			'facade-systems': [
				doc('panel-data-sheet', 'Panel Technical Data Sheet', 'Dimensions, tolerances, weights and material properties.', '1.9 MB'),
				doc('fire-classification', 'Fire Classification Report', 'Test results and classification for the full panel range.', '2.6 MB'),
				doc('thermal-tables', 'Thermal Performance Tables', 'U-values and thermal bridging data for standard build-ups.', '1.4 MB')
			],
			'modular-space': [
				doc('module-structural', 'Module Structural Specifications', 'Load tables, connection details and lifting points.', '2.3 MB'),
				doc('installation-guide', 'Installation Guide', 'Step-by-step site installation, tools and safety notes.', '4.2 MB')
			],
			portfolio: [
				doc('certifications', 'Certifications & Standards', 'Quality, safety and environmental certificates in one pack.', '2.0 MB'),
				doc('epd', 'Environmental Product Declarations', 'Third-party verified EPDs for our main product groups.', '3.1 MB')
			]
		}
	}
];
