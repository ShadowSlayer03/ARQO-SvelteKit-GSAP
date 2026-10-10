import sharp from 'sharp';
import { readdir, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const inputDir = path.join(root, 'src/lib/assets/references');
const outputDir = path.join(root, 'static/images/references');
const manifestPath = path.join(root, 'src/lib/generated/reference-images.ts');

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const locations = [
	'Ljubljana, Slovenia',
	'Copenhagen, Denmark',
	'Oslo, Norway',
	'Rotterdam, Netherlands',
	'Berlin, Germany',
	'Vienna, Austria',
	'Zurich, Switzerland',
	'Helsinki, Finland',
	'Stockholm, Sweden',
	'Barcelona, Spain'
];

const architects = [
	'Vuga',
	'Snohetta',
	'OMA',
	'BIG',
	'Zaha Hadid Architects',
	'UNStudio',
	'Foster + Partners',
	'Studio Libeskind',
	'Herzog & de Meuron',
	'Norm Architects'
];

const investors = [
	'ARCADIA',
	'Northstone Group',
	'Urban Collective',
	'Meridian Developments',
	'Atlas Properties',
	'Nordic Capital',
	'Vertex Holdings',
	'Urban Axis',
	'Pinnacle Estates',
	'Helix Group'
];

const buildingTypes = [
	'Shopping / Office',
	'Residential',
	'Commercial',
	'Cultural / Public',
	'Hotel / Hospitality',
	'Institutional',
	'Mixed Use',
	'Industrial'
];

const productTypes = [
	'Modular Facade System',
	'Prefabricated Architectural Wall',
	'Roofing System',
	'Structural Glazing',
	'External Solar Shading',
	'Curtain Wall System',
	'Unitized Facade System',
	'High-Performance Envelope'
];

function randomItem(items) {
	return items[Math.floor(Math.random() * items.length)];
}

async function getImages(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await getImages(fullPath)));
		} else if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
			files.push(fullPath);
		}
	}

	return files;
}

const sourceFiles = (await getImages(inputDir)).sort();
const manifest = [];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });

for (const sourceFile of sourceFiles) {
	const relativePath = path.relative(inputDir, sourceFile);
	const relativeWithoutExtension = relativePath.slice(
		0,
		-relativePath.length + relativePath.lastIndexOf('.')
	);

	const outputBase = path.join(outputDir, relativeWithoutExtension);
	const publicBase = `/images/references/${relativeWithoutExtension.split(path.sep).join('/')}`;
	const year = relativePath.split(path.sep)[0];

	await mkdir(path.dirname(outputBase), { recursive: true });

	await sharp(sourceFile)
		.rotate()
		.resize({ width: 900, withoutEnlargement: true })
		.webp({ quality: 80, effort: 4 })
		.toFile(`${outputBase}-thumb.webp`);

	await sharp(sourceFile)
		.rotate()
		.resize({ width: 2400, withoutEnlargement: true })
		.webp({ quality: 88, effort: 4 })
		.toFile(`${outputBase}-large.webp`);

	manifest.push({
		year,
		path: `${publicBase}-thumb.webp`,
		fullPath: `${publicBase}-large.webp`,
		location: randomItem(locations),
		architect: randomItem(architects),
		investor: randomItem(investors),
		buildingType: randomItem(buildingTypes),
		productType: randomItem(productTypes)
	});
}

manifest.sort((a, b) => a.year.localeCompare(b.year) || a.path.localeCompare(b.path));

await writeFile(
	manifestPath,
	`export default ${JSON.stringify(manifest, null, 2)} as const;\n`
);

console.log(`Generated ${manifest.length} image pairs and project metadata.`);
