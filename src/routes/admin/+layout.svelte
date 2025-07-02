<script lang="ts">
	import { onMount } from 'svelte';
	import { protectRoute } from '$lib/auth';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	onMount(() => {
		protectRoute();
	});
</script>

<!-- Layout Sidebar dan Topbar -->
<div class="flex flex-col w-full h-screen overflow-hidden">
	<!-- Topbar -->
	 <Topbar title="Dashboard" />
	<!-- Konten utama -->
	<div class="flex h-full bg-gray-100">
		<!-- Sidebar -->
		<Sidebar />

		<!-- Halaman aktif -->
		<main class="flex-1 overflow-y-auto p-6">
			<slot />
		</main>
	</div>
</div>
