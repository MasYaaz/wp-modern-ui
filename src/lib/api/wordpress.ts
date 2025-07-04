import { apiFetch } from './client';

const BASE = import.meta.env.VITE_API_URL || 'https://aic-aic-ternate.org/wp-json';

// 🔐 Login JWT
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

// 👤 Ambil profil user login
export async function getProfile() {
	return await apiFetch('/wp/v2/users/me?context=edit');
}

// Untuk update data user
export async function updateProfile(data: any) {
	return await apiFetch('/wp/v2/users/me', {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// Menghitung jumlah user
export async function getUsers() {
	return await apiFetch('/wp/v2/users');
}

// 📄 untuk artikel
export async function getPost(id: number) {
	return await apiFetch(`/wp/v2/posts/${id}`);
}

export async function getPosts() {
	return await apiFetch('/wp/v2/posts?_embed');
}

/**
 * 🔄 Update post WordPress
 * @param id ID post yang ingin diperbarui
 * @param data Objek data (title, content, status, dsb)
 * @returns Post yang sudah diperbarui
 */
export async function updatePost(id: number, data: any) {
	return await apiFetch(`/wp/v2/posts/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// Komentar
export async function getComments() {
	return await apiFetch('/wp/v2/comments');
}

export async function createPost(data: any) {
	return await apiFetch('/wp/v2/posts', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function deletePost(id: number) {
	return await apiFetch(`/wp/v2/posts/${id}?force=true`, {
		method: 'DELETE'
	});
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