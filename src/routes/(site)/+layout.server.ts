import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	return {
		introSeen: cookies.get('arqo-intro') === '1'
	};
};
