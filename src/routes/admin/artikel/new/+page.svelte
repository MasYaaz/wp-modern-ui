<script lang="ts">
	import { createPost } from '$lib/api/wordpress';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let title = '', content = '', error = '', success = '', saving = false;

	onMount(() => {
		const token = localStorage.getItem('token');
		if (!token) goto('/login');
	});

	async function savePost() {
		saving = true;
		error = '';
		success = '';

		try {
			const res = await createPost({
				title,
				content,
				status: 'publish'
			});

			success = 'Post berhasil dibuat';
			goto(`/posts/${res.id}`); // arahkan ke halaman edit post
		} catch (err: any) {
			error = err.message;
		} finally {
			saving = false;
		}
	}
</script>

<div class="p-6 max-w-3xl mx-auto">
	<h1 class="text-2xl font-bold mb-4 text-gray-800">Tambah Post Baru</h1>

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
</div>
