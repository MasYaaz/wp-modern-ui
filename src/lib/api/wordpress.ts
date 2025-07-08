import { apiFetch } from './client';

const BASE = import.meta.env.VITE_API_URL || 'https://aic-aic-ternate.org/wp-json';

// 🔐 Login ke WordPress menggunakan JWT
export async function login(username: string, password: string) {
	const res = await fetch(`${BASE}/jwt-auth/v1/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || 'Login gagal');
	}
	return await res.json(); // token + user info
}

// 👤 Mendapatkan data profil user yang sedang login
export async function getProfile() {
	return await apiFetch('/wp/v2/users/me?context=edit');
}

// Memperbarui informasi profil user login (nama, email, dsb
export async function updateProfile(data: any) {
	return await apiFetch('/wp/v2/users/me', {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// Mengambil daftar semua user
export async function getUsers() {
	return await apiFetch('/wp/v2/users');
}

// Menghitung jumlah komentar
export async function getUsersCount(): Promise<number> {
	const res = await fetch('https://aic-aic-ternate.org/wp-json/wp/v2/users?per_page=1');
	const total = res.headers.get('X-WP-Total');
	return total ? parseInt(total) : 0;
}

// Mengambil satu post berdasarkan ID
export async function getPost(id: number) {
	return await apiFetch(`/wp/v2/posts/${id}?_embed&nocache=${Date.now()}`);
}

// Mengambil semua post.
export async function getPosts() {
	return await apiFetch('/wp/v2/posts?_embed');
}

// Menghitung jumlah artikel
export async function getPostsCount(): Promise<number> {
	const res = await fetch('https://aic-aic-ternate.org/wp-json/wp/v2/posts?per_page=1');
	const total = res.headers.get('X-WP-Total');
	return total ? parseInt(total) : 0;
}

// Mengupdate post berdasarkan ID.
/**
 * 🔄 Update post WordPress
 * @param id ID post yang ingin diperbarui
 * @param data Objek data (title, content, status, dsb)
 * @returns Post yang sudah diperbarui
 */
export async function updatePost(id: number, data: any) {
	return await apiFetch(`/wp/v2/posts/${id}?_embed`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// Menyimpan artikel baru ke WordPress.
export async function createPost(data: any) {
	return await apiFetch('/wp/v2/posts', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

// Menghapus post secara permanen
export async function deletePost(id: number) {
	return await apiFetch(`/wp/v2/posts/${id}?force=true`, {
		method: 'DELETE'
	});
}

// Mengambil semua komentar.
export async function getComments() {
	return await apiFetch('/wp/v2/comments');
}

// Menghitung jumlah komentar
export async function getCommentsCount(): Promise<number> {
	const res = await fetch('https://aic-aic-ternate.org/wp-json/wp/v2/comments?per_page=1');
	const total = res.headers.get('X-WP-Total');
	return total ? parseInt(total) : 0;
}

// 📁 Upload media
export async function uploadMedia(file: File) {
	const formData = new FormData();
	formData.append('file', file);

	return await apiFetch('/wp/v2/media', {
		method: 'POST',
		body: formData,
		isFormData: true
	});
}

// 📁 Ambil daftar media (gambar)
export async function getMediaList() {
	return await apiFetch(
		'/wp/v2/media?per_page=100&_embed&' +
			'_fields=id,source_url,date,mime_type,title,media_details,file,meta,_embedded'
	);
}

// Menghapus gambar/media dari WordPress.
export async function deleteMedia(id: number, force = true) {
	return await apiFetch(`/wp/v2/media/${id}?force=true`, {
		method: 'DELETE'
	});
}

