<script lang="ts">
	import { onMount } from 'svelte';
	import { uploadMedia, deleteMedia } from '$lib/api/wordpress';
	import { Trash2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	import { mediaList,loadMediaList as loadMedia,resetMediaList } from '$lib/stores/upload';

	let files: File[] = [];
	let uploading = false;
	let error = '';
	let success = '';
	let selectedMedia: any = null;

	let title = '';
	let altText = '';
	let caption = '';
	let description = '';
	let showModal = false;

	$: if (selectedMedia) {
		title = selectedMedia.title?.raw ?? '';
		altText = selectedMedia.alt_text ?? '';
		caption = selectedMedia.caption?.raw ?? '';
		description = selectedMedia.description?.raw ?? '';
		showModal = true;
	}

	function closeDetail() {
		showModal = false;
		selectedMedia = null;
	}

	async function handleDelete(mediaId: number) {
		if (!confirm('Yakin ingin menghapus gambar ini?')) return;
		try {
			await deleteMedia(mediaId);
			mediaList.update((list) => list.filter((m) => m.id !== mediaId));
		} catch (e) {
			alert('Gagal menghapus media.');
			console.error(e);
		}
	}

	async function handleUpload() {
		if (!files.length) return;
		error = '';
		success = '';
		uploading = true;

		try {
			for (const file of files) {
				await uploadMedia(file);
			}
			success = 'Upload berhasil!';
			resetMediaList();
			await loadMedia();
		} catch (err: any) {
			error = err.message ?? 'Upload gagal.';
		} finally {
			uploading = false;
			files = [];
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		files = Array.from(input.files ?? []);
	}

	onMount(loadMedia);

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		success = 'URL disalin!';
		setTimeout(() => (success = ''), 2000);
	}

	function openDetail(media: any) {
		selectedMedia = media;
	}
</script>


<div class="mx-auto w-full space-y-6 pt-0 p-4">
	<h1 class="text-2xl font-bold">Media Pustaka</h1>

	<!-- Upload form -->
	<div class="space-y-2 rounded-lg bg-white p-4 shadow-lg">
		<input type="file" multiple accept="image/*" class="hover:text-blue-600 hover:cursor-pointer" on:change={handleFileChange} />

		<button
			on:click={handleUpload}
			class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			disabled={uploading || !files.length}
		>
			{uploading ? 'Mengunggah...' : 'Upload'}
		</button>

		{#if error}
			<p class="text-red-600">{error}</p>
		{/if}
		{#if success}
			<p class="text-green-600">{success}</p>
		{/if}
	</div>

	<!-- Media list -->
	<div class="grid grid-cols-3 gap-4 md:grid-cols-6 xl:grid-cols-9 2xl:grid-cols-12">
		{#each $mediaList as media}
			<!-- 📦 Pembungkus utama -->
			<div
				role="button"
				tabindex="0"
				class="group relative cursor-pointer overflow-hidden rounded bg-white text-left shadow-sm hover:shadow-lg focus:outline-3 outline-blue-500"
				on:click={() => openDetail(media)}
				on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openDetail(media)}
			>
				<!-- 🟦 Container persegi -->
				<div class="relative w-full bg-gray-100 pb-[100%]">
					<!-- 🔳 Gradient overlay -->
					<div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-600"></div>
					<img
						src={media.source_url}
						class="absolute inset-0 h-full w-full object-cover"
						alt={media.title?.rendered || 'Media image'}
					/>
					<!-- 🔳 Gradient overlay -->
					<div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>

					<!-- 🟨 Judul -->
					<div class="absolute bottom-0 px-2 pt-1 pb-2 text-xs text-white">
						{media.title?.rendered}
					</div>
				</div>

				<!-- 🟥 Tombol hapus -->
				<button
					type="button"
					class="absolute top-1 right-1 hidden rounded p-1 text-xs text-white group-hover:block hover:cursor-pointer hover:text-red-700"
					on:click|stopPropagation={() => handleDelete(media.id)}
					aria-label="hapus media"
				>
					<Trash2 size="12" />
				</button>
			</div>
		{/each}
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div 
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	transition:fade={{duration:150}}>
		<div class="w-full max-w-xl space-y-4 rounded-lg bg-white p-6 shadow">
			<h2 class="text-lg font-semibold">Detail Lampiran</h2>
			<img src={selectedMedia.source_url} alt={altText} class="mx-auto max-h-48 rounded" />
			<div class="space-y-1 border-t pt-4 text-sm text-gray-700">
				<p>
					<strong>Diunggah pada:</strong>
					{new Date(selectedMedia.date).toLocaleDateString('id-ID', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}
				</p>

				<p><strong>Diunggah oleh:</strong> {selectedMedia.author_name ?? 'Tidak diketahui'}</p>
				<p><strong>Dipakai di:</strong> {selectedMedia.post_title ?? 'Tidak digunakan'}</p>
				<p><strong>Nama berkas:</strong> {selectedMedia.media_details?.file}</p>
				<p><strong>Tipe berkas:</strong> {selectedMedia.mime_type}</p>
				<p>
					<strong>Ukuran berkas:</strong>
					{Math.round((selectedMedia.media_details?.filesize ?? 0) / 1024)} KB
				</p>

				{#if selectedMedia.media_details?.width && selectedMedia.media_details?.height}
					<p>
						<strong>Dimensi:</strong>
						{selectedMedia.media_details.width} x {selectedMedia.media_details.height} piksel
					</p>
				{/if}

				{#if selectedMedia.meta?.original_image}
					<p><strong>Gambar orisinil:</strong> {selectedMedia.meta.original_image}</p>
				{/if}
			</div>

			<div class="flex justify-between pt-4">
				<button class="rounded bg-gray-200 px-4 py-2" on:click={closeDetail}>Tutup</button>
			</div>
		</div>
	</div>
{/if}
