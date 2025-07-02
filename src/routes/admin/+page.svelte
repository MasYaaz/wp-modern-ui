<script lang="ts">
	import { onMount } from 'svelte';
	import { apiFetch } from '$lib/api/client';
	import { goto } from '$app/navigation';
	import { getPosts, getComments, getUsers } from '$lib/api/wordpress';

	let posts = 0,
		users = 0,
		comments = 0;
	let loading = true,
		error = '';

	onMount(async () => {
	loading = true;
	try {
		const [postData, userData, commentData] = await Promise.all([
			getPosts(),
			getUsers,  // kalau belum ada getUsers()
			getComments()
		]);
		posts = postData.length;
		users = userData.length;
		comments = commentData.length;
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
				<div class="w-full h-100 flex flex-col p-5 items-center justify-around">
					<img src="./logo-p-light.svg" alt="Yayasan Daya Lingmas Antarnusa" class="w-120"/>
					<div class="flex w-full items-center flex-col">
						<h1 class="text-xl">Selamat datang di Dashboard Admin</h1>
						<h1 class="text-base">Gunakan panel ini untuk mengelola artikel, halaman, dan konten situs.</h1>
					</div>
					
				</div>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div class="rounded-xl bg-white p-4 shadow items-center">
						<h2 class="text-lg font-semibold text-gray-700">Total Post</h2>
						<p class="text-3xl font-bold text-blue-600">{posts}</p>
					</div>
					<div class="rounded-xl bg-white p-4 shadow">
						<h2 class="text-lg font-semibold text-gray-700">Total Pengguna</h2>
						<p class="text-3xl font-bold text-green-600">{users}</p>
					</div>
					<div class="rounded-xl bg-white p-4 shadow">
						<h2 class="text-lg font-semibold text-gray-700">Komentar</h2>
						<p class="text-3xl font-bold text-purple-600">{comments}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
