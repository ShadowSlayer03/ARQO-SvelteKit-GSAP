const imageModules = import.meta.glob(
	'/src/lib/assets/references/**/*.{jpg,jpeg,png,webp}',
	{
		eager: true,
		query: {
			enhanced: true
		},
		import: 'default'
	}
);

const referenceImages = Object.entries(imageModules).map(([path, image]) => ({
	year: path.split('/').at(-2) ?? '',
	path: path.replace('/src/lib/assets', ''),
	image
}));

export default referenceImages;
