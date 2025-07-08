<script lang="ts">
	import { posts, loadPosts } from '$lib/stores/posts';
	import { onMount } from 'svelte';
	import { protectRoute } from '$lib/auth';
	import { deletePost } from '$lib/api/wordpress';
	import { SquarePen, Trash2 } from 'lucide-svelte';
	import { resetCounts } from '$lib/stores/count';

	let error = '';

	async function handleDelete(postid: number) {
		if (!confirm('Yakin ingin menghapus gambar ini?')) return;
		try {
			await deletePost(postid);
			posts.update((list) => list.filter((p) => p.id !== postid));
			resetCounts();
		} catch (e) {
			alert('Gagal menghapus media.');
			console.error(e);
		}
	}

	onMount(async () => {
		protectRoute();
		try {
			await loadPosts(); // hanya fetch kalau belum dimuat
		} catch (err: any) {
			error = err.message;
		}
	});
</script>

<div class="p-4 pt-0">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-800">Daftar Artikel</h1>
		<a
			href="/admin/artikel/new"
			class="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>
			Tambah Artikel
		</a>
	</div>
	{#if !$posts.length && !error}
		<p>Memuat artikel...</p>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else if !$posts.length}
		<p class="text-gray-900">Tidak ada Artikel</p>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each $posts as post}
				<div
					class="flex h-[280px] md:h-[300px] lg:h-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
				>
					{#if post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
						<img
							src={post._embedded['wp:featuredmedia'][0].source_url}
							alt="Thumbnail"
							class="h-35 w-full object-cover lg:h-65"
						/>
					{:else}
						<div
							class="flex h-40 w-full items-center justify-center bg-gray-200 text-sm text-gray-500 lg:h-60"
						>
							Tidak ada gambar
						</div>
					{/if}

					<!-- Konten -->
					<div class="flex flex-1 flex-col justify-between space-y-2 p-4">
						<div>
							<h2 class="line-clamp-2 text-sm md:text-lg font-bold">
								{@html post.title.rendered}
							</h2>
							<p class="text-xs lg:text-sm text-gray-600">
								{new Date(post.date).toLocaleDateString('id-ID')} ·
								{post._embedded?.author?.[0]?.name ?? 'Anonim'}
							</p>
						</div>
						<div class="mt-4 flex items-center justify-between">
							<button
								on:click|stopPropagation={() => handleDelete(post.id)}
								aria-label="penghapus"
								class="hover:cursor-pointer hover:text-red-600"
							>
								<Trash2 size="16" />
							</button>
							<a
								href={`/admin/artikel/${post.id}`}
								class="text-sm text-blue-600 hover:text-green-700"
								aria-label="edit artikel"
							>
								<SquarePen size="16" />
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
