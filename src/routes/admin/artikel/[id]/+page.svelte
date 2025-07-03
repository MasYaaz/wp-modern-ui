<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';
	import { getPost, updatePost, uploadMedia } from '$lib/api/wordpress';

	let post: any = null;
	let title = '';
	let content = '';
	let featuredImage = '';
	let featuredImageId: number | null = null;

	let error = '';
	let success = '';
	let loading = true;
	let saving = false;

	const id = $page.params.id;

	onMount(async () => {
		try {
			post = await getPost(Number(id));
			title = post.title.rendered;
			content = post.content.rendered;
			featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
			featuredImageId = post.featured_media;
		} catch (err: any) {
			error = 'Gagal memuat artikel.';
		} finally {
			loading = false;
		}
	});

	async function save() {
		saving = true;
		error = '';
		success = '';
		try {
			await updatePost(Number(id), {
				title,
				content,
				featured_media: featuredImageId
			});
			success = 'Artikel berhasil diperbarui.';
		} catch (err: any) {
			error = err.message || 'Gagal menyimpan perubahan.';
		} finally {
			saving = false;
		}
	}

	async function handleImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement)?.files?.[0];
		if (!file) return;
		try {
			const res = await uploadMedia(file);
			featuredImage = res.source_url;
			featuredImageId = res.id;
		} catch (e: any) {
			error = e.message || 'Upload gambar gagal.';
		}
	}
</script>

<div class="mx-auto w-full p-4">
	<div class="w-full flex justify-between">
		<h1 class="mb-4 text-2xl font-bold">Edit Artikel</h1>

		<a href="/admin/artikel" class="mb-4 inline-block text-sm text-black hover:text-red-500"
			><i class="fas fa-arrow-left px-1"></i>Kembali ke Daftar Artikel</a
		>
	</div>

	{#if loading}
		<p>Memuat artikel...</p>
	{:else if error}
		<p class="text-red-600">{error}</p>
	{:else}
		<TiptapEditor bind:content onUpdate={(html) => (content = html)} />
	{/if}
</div>
