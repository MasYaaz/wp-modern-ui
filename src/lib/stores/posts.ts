import { writable, get } from 'svelte/store';
import { getPosts as fetchPosts } from '$lib/api/wordpress';

export const posts = writable<any[]>([]);
export const postsLoaded = writable(false);

export async function loadPosts() {
	if (get(postsLoaded)) return;
	const data = await fetchPosts();
	posts.set(data);
	postsLoaded.set(true);
}

export function resetPosts() {
	posts.set([]);
	postsLoaded.set(false);
}
