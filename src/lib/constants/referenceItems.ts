const referenceItems = [
	{
		title: 'VANTA HOUSE',
		location: 'LONDON, UK',
		type: 'MIXED-USE',
		image: '/london-building.jpg',
		description:
			'ARQO engineered the building envelope for this sculptural mixed-use landmark, combining curved high-performance glazing with a precision aluminium rainscreen system. Custom solar-control glass and concealed shading elements were developed to maintain the uninterrupted architectural form while improving thermal performance.'
	},
	{
		title: 'NORTHLINE HQ',
		location: 'ROTTERDAM, NETHERLANDS',
		type: 'OFFICE',
		image: '/northline-hq.jpg',
		description:
			'For Northline HQ, ARQO delivered a high-performance unitised curtain wall system designed around demanding solar and acoustic requirements. Thermally broken aluminium profiles, low-e glazing and integrated vertical fins create a refined façade while reducing heat gain and glare across the workspaces.'
	},
	{
		title: 'ARCADIA RESIDENCES',
		location: 'COPENHAGEN, DENMARK',
		type: 'RESIDENTIAL',
		image: '/arcadia-residences.jpg',
		description:
			'ARQO developed the façade systems for this contemporary residential development, combining full-height insulated glazing with recessed balconies and bespoke aluminium screens. The envelope was engineered to balance daylight, privacy and solar protection while maintaining a clean Nordic character.'
	},
	{
		title: 'KUNSTWERK FORUM',
		location: 'VIENNA, AUSTRIA',
		type: 'CULTURAL',
		image: '/kunstwerk-forum.jpg',
		description:
			'ARQO engineered the envelope for this contemporary cultural forum, integrating a ventilated metal façade with expansive areas of high-performance glazing. The system was developed to provide controlled daylight and strong thermal performance while giving the building a precise, understated architectural expression.'
	}
];

const allReferenceItemsBasedOnYear = [
	{
		year: '2017',
		projects: [
			'/references/2017/project-01.jpg',
			'/references/2017/project-02.jpg',
			'/references/2017/project-03.jpg',
			'/references/2017/project-04.jpg',
			'/references/2017/project-05.jpg',
			'/references/2017/project-06.jpg',
			'/references/2017/project-07.jpg',
			'/references/2017/project-08.jpg',
			'/references/2017/project-09.jpg',
			'/references/2017/project-10.jpg',
			'/references/2017/project-11.jpg'
		]
	},
	{
		year: '2018',
		projects: [
			'/references/2018/project-01.jpg',
			'/references/2018/project-02.jpg',
			'/references/2018/project-03.jpg',
			'/references/2018/project-04.jpg',
			'/references/2018/project-05.jpg',
			'/references/2018/project-06.jpg',
			'/references/2018/project-07.jpg',
			'/references/2018/project-08.jpg',
			'/references/2018/project-09.jpg',
			'/references/2018/project-10.jpg',
			'/references/2018/project-11.jpg'
		]
	},
	{
		year: '2019',
		projects: [
			'/references/2019/project-01.jpg',
			'/references/2019/project-02.jpg',
			'/references/2019/project-03.jpg',
			'/references/2019/project-04.jpg',
			'/references/2019/project-05.jpg',
			'/references/2019/project-06.jpg',
			'/references/2019/project-07.jpg',
			'/references/2019/project-08.jpg',
			'/references/2019/project-09.jpg',
			'/references/2019/project-10.jpg',
			'/references/2019/project-11.jpg'
		]
	},
	{
		year: '2020',
		projects: [
			'/references/2020/project-01.jpg',
			'/references/2020/project-02.jpg',
			'/references/2020/project-03.jpg',
			'/references/2020/project-04.jpg',
			'/references/2020/project-05.jpg',
			'/references/2020/project-06.jpg',
			'/references/2020/project-07.jpg',
			'/references/2020/project-08.jpg',
			'/references/2020/project-09.jpg',
			'/references/2020/project-10.jpg',
			'/references/2020/project-11.jpg'
		]
	},
	{
		year: '2021',
		projects: [
			'/references/2021/project-01.jpg',
			'/references/2021/project-02.jpg',
			'/references/2021/project-03.jpg',
			'/references/2021/project-04.jpg',
			'/references/2021/project-05.jpg',
			'/references/2021/project-06.jpg',
			'/references/2021/project-07.jpg',
			'/references/2021/project-08.jpg',
			'/references/2021/project-09.jpg',
			'/references/2021/project-10.jpg',
			'/references/2021/project-11.jpg'
		]
	},
	{
		year: '2022',
		projects: [
			'/references/2022/project-01.jpg',
			'/references/2022/project-02.jpg',
			'/references/2022/project-03.jpg',
			'/references/2022/project-04.jpg',
			'/references/2022/project-05.jpg',
			'/references/2022/project-06.jpg',
			'/references/2022/project-07.jpg',
			'/references/2022/project-08.jpg',
			'/references/2022/project-09.jpg',
			'/references/2022/project-10.jpg',
			'/references/2022/project-11.jpg'
		]
	},
	{
		year: '2023',
		projects: [
			'/references/2023/project-01.jpg',
			'/references/2023/project-02.jpg',
			'/references/2023/project-03.jpg',
			'/references/2023/project-04.jpg',
			'/references/2023/project-05.jpg',
			'/references/2023/project-06.jpg',
			'/references/2023/project-07.jpg',
			'/references/2023/project-08.jpg',
			'/references/2023/project-09.jpg',
			'/references/2023/project-10.jpg',
			'/references/2023/project-11.jpg'
		]
	},
	{
		year: '2024',
		projects: [
			'/references/2024/project-01.jpg',
			'/references/2024/project-02.jpg',
			'/references/2024/project-03.jpg',
			'/references/2024/project-04.jpg',
			'/references/2024/project-05.jpg',
			'/references/2024/project-06.jpg',
			'/references/2024/project-07.jpg',
			'/references/2024/project-08.jpg',
			'/references/2024/project-09.jpg',
			'/references/2024/project-10.jpg',
			'/references/2024/project-11.jpg'
		]
	},
	{
		year: '2025',
		projects: [
			'/references/2025/project-01.jpg',
			'/references/2025/project-02.jpg',
			'/references/2025/project-03.jpg',
			'/references/2025/project-04.jpg',
			'/references/2025/project-05.jpg',
			'/references/2025/project-06.jpg',
			'/references/2025/project-07.jpg',
			'/references/2025/project-08.jpg',
			'/references/2025/project-09.jpg',
			'/references/2025/project-10.jpg',
			'/references/2025/project-11.jpg'
		]
	},
	{
		year: '2026',
		projects: [
			'/references/2026/project-01.jpg',
			'/references/2026/project-02.jpg',
			'/references/2026/project-03.jpg',
			'/references/2026/project-04.jpg',
			'/references/2026/project-05.jpg',
			'/references/2026/project-06.jpg',
			'/references/2026/project-07.jpg',
			'/references/2026/project-08.jpg',
			'/references/2026/project-09.jpg',
			'/references/2026/project-10.jpg',
			'/references/2026/project-11.jpg'
		]
	}
];

export { allReferenceItemsBasedOnYear }
export default referenceItems;
