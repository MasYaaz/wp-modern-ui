import { writable, get } from 'svelte/store';
import { getProfile as fetchProfile } from '$lib/api/wordpress';

export const user = writable<any>(null);
export const userLoaded = writable(false);

// Hanya fetch profil sekali
export async function loadUserProfile() {
	if (get(userLoaded)) return; // Sudah dimuat

	try {
		const data = await fetchProfile();
		if (data) {
			user.set(data);
			userLoaded.set(true);
		}
	} catch (err) {
		console.error('Gagal memuat profil user:', err);
	}
}

export function resetUserProfile() {
	user.set(null);
	userLoaded.set(false);
}