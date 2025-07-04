<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let editor: any;
	export let types: { type: string; icon: string; label: string }[] = [
		{ type: 'bulletList', icon: 'fa-list-ul', label: 'Bullet List' },
		{ type: 'orderedList', icon: 'fa-list-ol', label: 'Ordered List' },
		{ type: 'taskList', icon: 'fa-square-check', label: 'Task List' }
	];

	let open = false;
	let dropdownRef: HTMLElement;
	let activeType: string | null = null;

	function updateActiveType() {
		if (editor) {
			activeType = types.find((t) => editor.isActive(t.type))?.type ?? null;
		}
	}

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		open = !open;
	}

	function selectList(type: string) {
		if (!editor) return;

		const chain = editor.chain().focus();

		if (type === 'bulletList') {
			chain.toggleBulletList().run();
		} else if (type === 'orderedList') {
			chain.toggleOrderedList().run();
		} else if (type === 'taskList') {
			chain.toggleTaskList().run();
		}

		updateActiveType();
		open = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (open && dropdownRef && !dropdownRef.contains(event.target as Node)) {
			open = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		updateActiveType();
		if (editor) {
			editor.on('selectionUpdate', updateActiveType);
			editor.on('transaction', updateActiveType);
		}
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
		if (editor) {
			editor.off('selectionUpdate', updateActiveType);
			editor.off('transaction', updateActiveType);
		}
	});
</script>

<div class="relative inline-block" bind:this={dropdownRef}>
	<button
		on:click={toggleDropdown}
		class="flex w-fit items-center py-1 text-sm font-medium hover:cursor-pointer hover:text-blue-500"
	>
		<!-- Gunakan ikon bullet list sebagai default -->
		<i
			class="fa-solid fa-list-ul text-sm"
			class:fa-list-ul={activeType === 'bulletList' || !activeType}
			class:fa-list-ol={activeType === 'orderedList'}
			class:fa-square-check={activeType === 'taskList'}
		></i>

		<!-- Panah dropdown -->
		<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if open}
		<div
			class="absolute z-10 mt-1 flex w-fit flex-col items-center overflow-hidden rounded-xl border-gray-300 bg-white shadow"
		>
			{#each types as t}
				<button
					on:click={() => selectList(t.type)}
					class="flex w-26 items-center px-2 py-1 text-left font-medium hover:bg-gray-100"
					class:bg-blue-100={editor?.isActive(t.type)}
				>
					<i class={`fa-solid ${t.icon} text-base`}></i>
					<span class="ml-1 text-xs">{t.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
