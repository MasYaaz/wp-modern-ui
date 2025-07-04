<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let editor: any;
	export let levels: number[] = [1, 2, 3, 4, 5, 6];

	let open = false;
	let dropdownRef: HTMLElement;
	let activeLevel: number | null = null;

	function updateActiveLevel() {
		if (editor) {
			activeLevel = levels.find((level) => editor.isActive('heading', { level })) ?? null;
		}
	}

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		open = !open;
	}

	function selectHeading(level: number) {
		if (!editor) return;
		editor.chain().focus().toggleHeading({ level }).run();
		updateActiveLevel(); // update manual
		open = false;
	}

	// Handle klik luar dropdown
	function handleClickOutside(event: MouseEvent) {
		if (open && dropdownRef && !dropdownRef.contains(event.target as Node)) {
			open = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		updateActiveLevel(); // set awal

		// Listen ke perubahan selection atau isi editor
		if (editor) {
			editor.on('selectionUpdate', updateActiveLevel);
			editor.on('transaction', updateActiveLevel);
		}
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);

		if (editor) {
			editor.off('selectionUpdate', updateActiveLevel);
			editor.off('transaction', updateActiveLevel);
		}
	});
</script>

<!-- Wrapper -->
<div class="relative inline-block" bind:this={dropdownRef}>
	<!-- Trigger Button -->
	<button
		on:click={toggleDropdown}
		class="flex items-center py-1 text-sm font-medium hover:cursor-pointer hover:text-blue-500"
	>
		<!-- Font Awesome Heading Icon -->
		<i class="fa-solid fa-heading text-sm"></i>

		<!-- Active Heading Level -->
		{#if activeLevel}
			<span class="-mb-[2px] ml-[1px] text-[10px]">{activeLevel}</span>
		{/if}

		<!-- Dropdown Arrow -->
		<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<!-- Dropdown List -->
	{#if open}
		<div
			class="absolute left-1/2 z-10 mt-1 flex overflow-hidden -translate-x-1/2 flex-col items-center rounded-lg bg-white shadow"
		>
			{#each levels as level}
				<button
					on:click={() => selectHeading(level)}
					class="flex w-full items-center px-3 py-1 text-left font-medium hover:bg-gray-100"
					class:bg-blue-100={editor?.isActive('heading', { level })}
				>
					<i class="fa-solid fa-heading"></i>
					<span class="-mb-[2px] ml-[1px] text-[10px]">{level}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
