import { writable } from 'svelte/store';
import { getProfile as fetchProfile } from '$lib/api/wordpress';

export const user = writable<any>(null);
export const userLoaded = writable(false);

// Fungsi untuk ambil dan simpan ke store (hanya sekali)
export async function loadUserProfile() {
	let loaded = false;
	userLoaded.subscribe((val) => loaded = val)();
	if (loaded) return; // sudah dimuat

	const data = await fetchProfile();
	if (data) {
		user.set(data);
		userLoaded.set(true);
	}
}