export const IMAGE_WIDTHS = [480, 960, 1440, 1920, 2560] as const;
export const IMAGE_FALLBACK_WIDTH = 1920;

function imageStem(src: string) {
	const file = src.split('/').pop() ?? src;
	return file.replace(/\.[^.]+$/, '');
}

export function optimizedImage(src: string, width: number = IMAGE_FALLBACK_WIDTH) {
	return `/images/opt/${imageStem(src)}-${width}.webp`;
}

export function optimizedSrcset(src: string) {
	return IMAGE_WIDTHS.map((width) => `${optimizedImage(src, width)} ${width}w`).join(', ');
}
