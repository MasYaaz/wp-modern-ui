import { uploadMedia } from '$lib/api/wordpress';
import { writable, get } from 'svelte/store';
import { getMediaList as fetchMediaList } from '$lib/api/wordpress';

// 🖼️ Semua media & status loading
export const mediaList = writable<any[]>([]);
export const mediaLoaded = writable(false);
export const currentMedia = writable<any>(null);

let featuredImage = '';
let error = '';
let featuredImageId: number | null = null;

export async function handleImageUpload(
	file: File
): Promise<{ src: string; id: number }> {
	try {
		const res = await uploadMedia(file);

		mediaList.update((list) => [res, ...list]); // ⬅️ Tambah media baru ke awal list
		
		// Simpan ke variabel global jika memang dibutuhkan
		featuredImage = res.source_url;
		featuredImageId = res.id;

		return {
			src: res.source_url,
			id: res.id
		};
	} catch (e: any) {
		error = e.message || 'Upload gambar gagal.';
		return {
			src: '',
			id: 0
		};
	}
}

// 🚀 Load semua media (sekali saja)
export async function loadMediaList() {
	if (get(mediaLoaded)) return;
	const data = await fetchMediaList();
	mediaList.set(data);
	mediaLoaded.set(true);
}

// 🧹 Reset media cache
export function resetMediaList() {
	mediaList.set([]);
	mediaLoaded.set(false);
}