import { writable, get } from 'svelte/store';
import { getComments as fetchComments } from '$lib/api/wordpress';

export const comments = writable<any[]>([]);
export const commentsLoaded = writable(false);

export async function loadComments() {
	if (get(commentsLoaded)) return;
	const data = await fetchComments();
	comments.set(data);
	commentsLoaded.set(true);
}

export function resetComments() {
	comments.set([]);
	commentsLoaded.set(false);
}
