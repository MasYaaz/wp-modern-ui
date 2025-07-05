<script lang="ts">
	import { faChevronDown, faListOl, faListUl, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount, onDestroy } from 'svelte';

	export let editor: any;
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
	
	export let types: { type: string; icon: IconDefinition; label: string }[] = [
			{ type: 'bulletList', icon: faListUl, label: 'Bullet List' },
			{ type: 'orderedList', icon: faListOl, label: 'Ordered List' },
			{ type: 'taskList', icon: faSquareCheck, label: 'Task List' }
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
		<FontAwesomeIcon
			icon={
				activeType === 'orderedList'
					? faListOl
					: activeType === 'taskList'
					? faSquareCheck
					: faListUl
			}
		/>

		<!-- Panah dropdown -->
		<FontAwesomeIcon icon={faChevronDown} class="text-[10px] p-[2px] py-1"/>
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
					<FontAwesomeIcon icon={t.icon}/>
					<span class="ml-1 text-xs">{t.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
