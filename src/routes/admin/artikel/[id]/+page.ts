// src/routes/posts/[id]/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const id = parseInt(params.id);
	return { id }; // kita hanya lempar ID, fetch post tetap di client (perlu token)
};
