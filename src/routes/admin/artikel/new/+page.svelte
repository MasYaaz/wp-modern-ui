<script lang="ts">
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';
	import { createPost } from '$lib/api/wordpress';
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import { handleImageUpload } from '$lib/stores/upload';
	import { resetPosts } from '$lib/stores/posts';
	import { resetCounts } from '$lib/stores/count';

	let title = '';
	let content = '';
	let featuredImageId: number | null = null;
	let featuredImage = '';

	async function handleSave() {
		try {
			const post = await createPost({
				title,
				content,
				status: 'publish'
			});

			if (post?.id) {
				resetCounts();
				resetPosts();
				toast.push('✅ Artikel berhasil disimpan!', {
					theme: {
						'--toastBackground': '#2563eb',
						'--toastColor': 'white'
					}
				});
				goto(`/admin/artikel`);
			} else {
				toast.push('❌ Gagal menyimpan artikel.');
			}
		} catch (error) {
			console.error(error);
			toast.push('❌ Terjadi kesalahan saat menyimpan artikel.');
		}
	}

</script>

<main class="space-y-4 p-6">
	<h1 class="text-2xl font-semibold">Tambah Artikel</h1>

	<TiptapEditor
		{content}
		onUpdate={(html) => (content = html)}
		bind:title
		bind:featuredImage
		bind:featuredImageId
		onSave={handleSave}
		onInsertImage={handleImageUpload}
	/>
</main>
