<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getPosts, updatePost } from '$lib/api/wordpress';

	export let data: { id: number };

	let title = '', content = '', loading = true, saving = false, error = '', success = '';

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) return goto('/login');

		try {
			const post = await getPosts(data.id);
			title = post.title.rendered;
			content = post.content.raw ?? post.content.rendered;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	});

	async function savePost() {
		saving = true;
		error = '';
		success = '';
		try {
			await updatePost(data.id, {
				title,
				content,
				status: 'publish'
			});
			success = 'Post berhasil disimpan';
		} catch (err: any) {
			error = err.message;
		} finally {
			saving = false;
		}
	}
</script>

<div class="p-6 max-w-3xl mx-auto">
	<h1 class="text-2xl font-bold mb-4 text-gray-800">Edit Post</h1>

	{#if loading}
		<p>Loading...</p>
	{:else}
		<div class="space-y-4">
			{#if error}
				<p class="text-red-600">{error}</p>
			{/if}
			{#if success}
				<p class="text-green-600">{success}</p>
			{/if}

			<input
				type="text"
				bind:value={title}
				class="w-full p-2 border rounded"
				placeholder="Judul post"
			/>

			<textarea
				bind:value={content}
				class="w-full p-3 border rounded min-h-[200px]"
				placeholder="Konten post (HTML)"
			></textarea>

			<button
				on:click={savePost}
				class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				disabled={saving}
			>
				{saving ? 'Menyimpan...' : 'Simpan'}
			</button>
		</div>
	{/if}
</div>
