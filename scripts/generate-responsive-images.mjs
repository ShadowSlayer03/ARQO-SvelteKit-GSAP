import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const inputDir = path.join(root, 'static');
const outputDir = path.join(root, 'static/images/opt');

const widths = [480, 960, 1440, 1920, 2560];
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png']);
const concurrency = 4;

const sourceFiles = (await readdir(inputDir, { withFileTypes: true }))
	.filter(
		(entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())
	)
	.map((entry) => path.join(inputDir, entry.name))
	.sort();

await mkdir(outputDir, { recursive: true });

let generated = 0;
let skipped = 0;
let inputBytes = 0;
let outputBytes = 0;

async function isUpToDate(source, target) {
	try {
		const [sourceStat, targetStat] = await Promise.all([stat(source), stat(target)]);
		return targetStat.size > 0 && targetStat.mtimeMs >= sourceStat.mtimeMs;
	} catch {
		return false;
	}
}

async function optimizeImage(source) {
	const stem = path.basename(source, path.extname(source));
	const sourceStat = await stat(source);
	inputBytes += sourceStat.size;

	for (const width of widths) {
		const target = path.join(outputDir, `${stem}-${width}.webp`);

		if (await isUpToDate(source, target)) {
			skipped++;
			outputBytes += (await stat(target)).size;
			continue;
		}

		await sharp(source)
			.rotate()
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: 80, effort: 4 })
			.toFile(target);

		generated++;
		outputBytes += (await stat(target)).size;
	}

	console.log(`optimized ${path.basename(source)}`);
}

let cursor = 0;

await Promise.all(
	Array.from({ length: Math.min(concurrency, sourceFiles.length) }, async () => {
		while (cursor < sourceFiles.length) {
			const source = sourceFiles[cursor++];
			await optimizeImage(source);
		}
	})
);

const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

console.log(
	`\nResponsive images: ${generated} generated, ${skipped} reused. Source ${formatMb(inputBytes)} -> variants ${formatMb(outputBytes)}.`
);
