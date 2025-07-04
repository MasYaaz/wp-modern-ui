import { writable, get } from 'svelte/store';
import {
	getPosts as fetchPosts,
	getPost as fetchPost,
	updatePost as apiUpdatePost
} from '$lib/api/wordpress';

// ✅ Store global
export const posts = writable<any[]>([]);
export const postsLoaded = writable(false);
export const currentPost = writable<any>(null);

// 🚀 Load semua post (sekali saja)
export async function loadPosts() {
	if (get(postsLoaded)) return;
	const data = await fetchPosts();
	posts.set(data);
	postsLoaded.set(true);
}

// 🧹 Reset semua post (cache kosong)
export function resetPosts() {
	posts.set([]);
	postsLoaded.set(false);
}

// 🔁 Load satu post berdasarkan ID
export async function loadPost(id: number) {
	// Cek cache dulu
	const cached = get(posts).find((p) => p.id === id);
	if (cached) {
		currentPost.set(cached);
		return cached;
	}

	// Kalau tidak ada di cache, fetch dari API
	const fetched = await fetchPost(id);
	currentPost.set(fetched);
	return fetched;
}

// ✏️ Update post dan perbarui cache
export async function updatePostCache(id: number, data: any) {
	const updated = await apiUpdatePost(id, data);

	// Update daftar post (jika ada)
	posts.update((items) =>
		items.map((post) => (post.id === id ? updated : post))
	);

	// Update currentPost juga kalau cocok
	if (get(currentPost)?.id === id) {
		currentPost.set(updated);
	}

	return updated;
}
