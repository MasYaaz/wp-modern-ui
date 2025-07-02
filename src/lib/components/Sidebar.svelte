<script lang="ts">
	import { sidebarCollapsed, sidebarOpen } from '$lib/stores/sidebar';

	const menuItems = [
		{ iconType: 'material', icon: 'dashboard', label: 'Dashboard', href: '/admin' },
		{ iconType: 'fa', icon: 'fa-solid fa-newspaper', label: 'Artikel', href: '/admin/artikel' },
		{ iconType: 'fa', icon: 'fa-solid fa-message', label: 'Komentar', href: '/admin/komentar' }
	];
</script>

<!-- Overlay untuk mobile -->
{#if $sidebarOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/30 md:hidden"
		aria-label="Close sidebar overlay"
		tabindex="0"
		on:click={() => sidebarOpen.set(false)}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				sidebarOpen.set(false);
			}
		}}
		style="all: unset; position: fixed; inset: 0; z-index: 40; background: rgba(0,0,0,0.3);"
	></button>
{/if}

<!-- Width berubah sesuai collapse -->
<!-- Sidebar -->
<div
	class={`z-50 flex flex-col bg-white transition-all duration-300
		${$sidebarCollapsed ? 'w-[64px]' : 'w-60'}
		md:flex 
		${$sidebarOpen ? 'fixed inset-y-0 left-0 w-[70%] flex flex-col translate-x-0 shadow-lg' : 'fixed inset-y-0 left-0 -translate-x-full'}
		md:relative md:translate-x-0 md:shadow-none
	`}
>
	<!-- Menu -->
	<nav class="mt-0 md:mt-4 flex-1 space-y-1 overflow-y-auto">
		<div class="md:hidden px-1 w-full">
			<img src="../logo-light.svg" class="w-30" alt="logo besar" />
		</div>
		{#each menuItems as item}
			<a
				href={item.href}
				on:click={() => sidebarOpen.set(false)}
				class="sidebar-item flex items-center gap-3 px-4 py-2 text-sm font-bold transition hover:bg-blue-50 hover:text-blue-600"
			>
				{#if item.iconType === 'fa'}
					<i class={`${item.icon} w-7 p-1 text-center text-[20px]`}></i>
				{:else if item.iconType === 'material'}
					<span class="material-symbols-outlined w-7 p-[1.5px]">{item.icon}</span>
				{/if}

				{#if !$sidebarCollapsed || $sidebarOpen}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>
</div>

<style>
	.material-symbols-outlined {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}
</style>
