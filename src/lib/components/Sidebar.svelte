<script lang="ts">
	import { sidebarCollapsed, sidebarOpen } from '$lib/stores/sidebar';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faNewspaper, faMessage } from '@fortawesome/free-solid-svg-icons';
	import { Images, LayoutDashboardIcon } from 'lucide-svelte';

	const menuItems = [
		{ iconType: 'lucide', icon: LayoutDashboardIcon, label: 'Dashboard', href: '/admin' },
		{ iconType: 'fa', icon: faNewspaper, label: 'Artikel', href: '/admin/artikel' },
		{ iconType: 'fa', icon: faMessage, label: 'Komentar', href: '/admin/komentar' },
		{ iconType: 'lucide', icon: Images, label: 'Pustaka Media', href: '/admin/media' }
	] as const;
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
					<FontAwesomeIcon icon={item.icon as import('@fortawesome/fontawesome-svg-core').IconDefinition} class="w-6 text-base"/>
				{:else if item.iconType === 'lucide'}
					<item.icon class="w-6" size="18" strokeWidth="2.3"/>
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
