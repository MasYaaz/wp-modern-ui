<script lang="ts">
	import { onMount } from 'svelte';
	import { posts, loadPosts } from '$lib/stores/posts';
	import { users, loadUsers } from '$lib/stores/users';
	import { comments, loadComments } from '$lib/stores/comments';

	let loading = true, error = '';

	onMount(async () => {
	loading = true;
	try {
		await Promise.all([loadPosts(), loadUsers(), loadComments()]);
	} catch (err: any) {
		error = err.message || 'Gagal memuat data';
	} finally {
		loading = false;
	}
});
</script>

<div class="min-h-fit w-full rounded-2xl bg-white shadow-xl">
	<div class="flex p-5">
		{#if loading}
			<p>Memuat data...</p>
		{:else if error}
			<p class="text-red-500">{error}</p>
		{:else}
			<div class="flex w-full flex-col">
				<div class="flex h-100 w-full flex-col items-center justify-around p-5">
					<img src="./logo-p-light.svg" alt="Yayasan Daya Lingmas Antarnusa" class="w-120" />
					<div class="flex w-full flex-col items-center">
						<h1 class="text-xl">Selamat datang di Dashboard Admin</h1>
						<h1 class="text-base">
							Gunakan panel ini untuk mengelola artikel, halaman, dan konten situs.
						</h1>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div class="items-center rounded-xl bg-white p-4 shadow">
						<h2 class="text-lg font-semibold text-gray-700">Total Post</h2>
						<p class="text-3xl font-bold text-blue-600">{$posts.length}</p>
					</div>
					<div class="rounded-xl bg-white p-4 shadow">
						<h2 class="text-lg font-semibold text-gray-700">Total Pengguna</h2>
						<p class="text-3xl font-bold text-green-600">{$users.length}</p>
					</div>
					<div class="rounded-xl bg-white p-4 shadow">
						<h2 class="text-lg font-semibold text-gray-700">Komentar</h2>
						<p class="text-3xl font-bold text-purple-600">{$comments.length}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
