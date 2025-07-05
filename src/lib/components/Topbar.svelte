<script lang="ts">
	export let title = 'Dashboard';
	import { onMount } from 'svelte';
	let user = {
		name: '',
		initial: '',
		avatarUrl: '',
		email: ''
	};
	import { goto } from '$app/navigation';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { scale } from 'svelte/transition';
	import { sidebarCollapsed, sidebarOpen } from '$lib/stores/sidebar';
	import { resetAllStores } from '$lib/stores/logout';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faUser, faCog, faBars, faChevronRight, faChevronLeft, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
	let avatarButton: HTMLElement;
	let showMenu = false;

	function toggleSidebar() {
		if (window.innerWidth < 768) {
			// Mobile: toggle overlay
			sidebarOpen.update((v) => !v);
		} else {
			// Desktop: toggle collapse
			sidebarCollapsed.update((v) => !v);
		}
	}

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) return;

		try {
			const res = await fetch('https://aic-aic-ternate.org/wp-json/wp/v2/users/me', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!res.ok) throw new Error('Gagal ambil data user');

			const data = await res.json();

			user.name = data.name || data.username || 'Admin';
			user.initial = user.name[0]?.toUpperCase() || 'A';
			user.avatarUrl = data.avatar_urls?.['96'] || '';
			user.email = data.email || '';
		} catch (e) {
			console.error('Gagal mengambil data user:', e);
		}
	});

	function logout() {
		localStorage.removeItem('token');
		resetAllStores; // menghapus semua cache user
		goto('/login');
	}
</script>

<header class="flex items-center bg-white pr-3 shadow md:pr-6">
	<!-- Logo -->
	<div
		class={`hidden w-fit justify-center gap-2 md:flex ${$sidebarCollapsed ? 'px-[13px] py-2' : 'px-12 py-2'}`}
	>
		{#if !$sidebarCollapsed}
			<img src="/logo-p-light.svg" class="w-44" alt="logo besar" />
		{/if}
		{#if $sidebarCollapsed}
			<img src="/logo-light.svg" class="w-10" alt="logo kecil" />
		{/if}
	</div>
	<div class="flex px-2 md:px-0 w-full items-center justify-between">
		<!-- Tombol hanya muncul di mobile -->
		<button
			on:click={toggleSidebar}
			class="rounded p-2 transition hover:bg-gray-100 md:inline-block"
		>
			<!-- Mobile (md:hidden): icon menu -->
			<span class="block md:hidden">
				<FontAwesomeIcon icon={faBars} class="text-base"/>
			</span>

			<!-- Desktop (md:inline): collapse icon -->
			<span class="mx-2 hidden text-sm md:inline">
				{#if $sidebarCollapsed}
					<FontAwesomeIcon icon={faChevronRight} class="text-base"/>
				{:else}
					<FontAwesomeIcon icon={faChevronLeft} class="text-base"/>
				{/if}
			</span>
		</button>
		<h1 class="text-lg font-semibold">{title}</h1>
		<!-- User dropdown -->
		<div class="relative">
			<button
				on:click={() => (showMenu = !showMenu)}
				bind:this={avatarButton}
				class="flex items-center gap-2 transition-transform duration-300 hover:scale-110 hover:cursor-pointer focus:outline-none"
			>
				{#if user.avatarUrl}
					<img src={user.avatarUrl} alt="User avatar" class="h-10 w-10 md:w-15 md:h-15 p-1 object-cover" />
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-black"
					>
						{user.initial}
					</div>
				{/if}
			</button>

			{#if showMenu}
				<div
					class="absolute right-0 z-50 w-55"
					use:clickOutside={{ ignore: [avatarButton], callback: () => (showMenu = false) }}
					in:scale={{ duration: 150, start: 0.95 }}
					out:scale={{ duration: 100 }}
				>
					<!-- Segitiga (ekor chat) -->
					<div
						class="absolute top-3 right-4 z-0 -mt-1 h-3 w-3 rotate-45 bg-gray-100 shadow-lg"
					></div>
					<div
						class="absolute right-0 z-50 mt-3 flex w-45 flex-col items-center rounded-xl bg-gray-100 shadow-md"
					>
						<div class="flex w-full flex-col px-4 py-3">
							<h2 class="text-md font-bold text-gray-700 md:inline">{user.name}</h2>
							<h3 class="text-[12px] font-medium text-gray-700 md:inline">{user.email}</h3>
						</div>
						<div class="mt-2 mb-1 w-[90%] border-[0.1px] border-t border-gray-500"></div>
						<div class="flex w-full flex-col px-3 py-1">
							<a
								href="/admin/profile"
								class="block py-1 text-left text-sm font-medium hover:bg-gray-100 hover:font-bold"
								><FontAwesomeIcon icon={faUser} class="w-6"/>Profil</a
							>
							<button
								on:click={logout}
								class="w-full py-1 text-left text-sm font-medium text-red-600 hover:cursor-pointer hover:bg-gray-100 hover:font-bold"
							>
								<FontAwesomeIcon icon={faDoorOpen} class="w-6"/>Logout
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>
