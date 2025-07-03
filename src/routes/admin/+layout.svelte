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
<div class="flex flex-col h-screen overflow-hidden">
  <!-- Topbar -->
  <Topbar title="Dashboard" />

  <div class="flex flex-1 overflow-hidden bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Konten utama yang bisa scroll -->
    <main class="flex-1 overflow-y-auto px-[5px] py-3 lg:p-6">
      <slot />
    </main>
  </div>
</div>


