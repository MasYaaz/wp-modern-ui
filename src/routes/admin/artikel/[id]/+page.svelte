<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';
	import { loadPost, updatePostCache, currentPost } from '$lib/stores/posts';
	import { toast } from '@zerodevx/svelte-toast';
	import { convertGutenbergImagesToResizable } from '$lib/utils/Converter';
	import { handleImageUpload } from '$lib/stores/upload';

	let title = '';
	let content = '';
	let featuredImage = '';
	let featuredImageId: number | null = null;

	let error = '';
	let loading = true;
	let saving = false;

	const id = +$page.params.id;

	onMount(async () => {
		try {
			const post = await loadPost(id); // 🔁 pakai caching store

			title = post.title.rendered;
			content = convertGutenbergImagesToResizable(post.content.rendered); // 🧠 konversi di sini

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

		try {
			const post = await loadPost(id); // Ambil post yang lama
			await updatePostCache(id, {
				title,
				content,
				featured_media: featuredImageId,
				author: post.author // Kirim ulang author lama
			});
			toast.push('✅ Artikel berhasil disimpan!', {
				theme: {
					'--toastBackground': '#16a34a',
					'--toastColor': 'white',
					'--toastBarBackground': 'white'
				}
			});
		} catch (err: any) {
			toast.push('❌ Gagal menyimpan: ' + (err.message || ''), {
				theme: {
					'--toastBackground': '#dc2626',
					'--toastColor': 'white',
					'--toastBarBackground': 'white'
				}
			});
		} finally {
			saving = false;
		}
		if (!featuredImageId) {
			toast.push('🚫 Pilih featured image dulu!');
			return;
		}
	}
</script>

<div class="mx-auto h-full w-full p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<h1 class="mb-2 text-2xl font-bold">Edit Artikel</h1>
		<a href="/admin/artikel" class="mb-2 inline-block text-sm text-black hover:text-red-500"
			><i class="fas fa-arrow-left px-1"></i>Kembali ke Daftar Artikel</a
		>
	</div>

	{#if loading}
		<p>Memuat artikel...</p>
	{:else if error}
		<p class="text-red-600">{error}</p>
	{:else}
		<TiptapEditor
			{content}
			onUpdate={(html) => (content = html)}
			{title}
			bind:featuredImage
			bind:featuredImageId
			onTitleChange={(val) => (title = val)}
			onInsertImage={handleImageUpload}
			onSave={save}
		/>
	{/if}
</div>
