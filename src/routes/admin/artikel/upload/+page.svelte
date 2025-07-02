<script lang="ts">
	import { uploadMedia } from '$lib/api/wordpress';
	let file: File | null = null;
	let uploading = false;
	let error = '', success = '', imageUrl = '';

	async function handleUpload() {
		if (!file) return;
		error = '';
		success = '';
		imageUrl = '';
		uploading = true;

		try {
			const media = await uploadMedia(file);
			imageUrl = media.source_url;
			success = 'Upload berhasil!';
		} catch (err: any) {
			error = err.message;
		} finally {
			uploading = false;
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		file = input.files?.[0] ?? null;
	}
</script>

<div class="max-w-xl mx-auto p-4 space-y-4">
	<h1 class="text-xl font-bold">Upload Media</h1>

	<input type="file" accept="image/*" on:change={handleFileChange} class="block" />

	<button
		on:click={handleUpload}
		class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
		disabled={uploading || !file}
	>
		{uploading ? 'Mengunggah...' : 'Upload'}
	</button>

	{#if error}
		<p class="text-red-600">{error}</p>
	{/if}
	{#if success}
		<p class="text-green-600">{success}</p>
	{/if}

	{#if imageUrl}
		<div class="mt-4">
			<p class="text-sm text-gray-600">URL Gambar:</p>
			<input type="text" readonly class="w-full p-2 border rounded" value={imageUrl} />
			<img src={imageUrl} alt="Preview" class="mt-4 rounded shadow max-w-xs" />
		</div>
	{/if}
</div>
