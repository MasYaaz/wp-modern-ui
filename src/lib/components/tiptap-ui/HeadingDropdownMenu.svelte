<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { editor } from '$lib/stores/editor';
	import { faChevronDown, faHeading } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { Heading } from 'lucide-svelte';

	let open = false;
	let currentEditor: any = null;
	let dropdownRef: HTMLElement;
	let activeLevel: number | null = null;

	const levels = [1, 2, 3, 4, 5, 6];

	const unsubscribe = editor.subscribe((value) => {
		currentEditor = value;
		updateActiveLevel();
	});

	function updateActiveLevel() {
		if (!currentEditor) return;
		const found = levels.find((level) => currentEditor?.isActive('heading', { level }));
		activeLevel = found ?? null;
	}

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		open = !open;
	}

	function handleClickOutside(event: MouseEvent) {
		if (open && dropdownRef && !dropdownRef.contains(event.target as Node)) {
			open = false;
		}
	}

	function setHeading(level: number) {
		if (!currentEditor) return;
		currentEditor.chain().focus().toggleHeading({ level }).run();
		updateActiveLevel();
		open = false;
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		currentEditor?.on('selectionUpdate', updateActiveLevel);
		currentEditor?.on('transaction', updateActiveLevel);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
		currentEditor?.off('selectionUpdate', updateActiveLevel);
		currentEditor?.off('transaction', updateActiveLevel);
		unsubscribe();
	});
</script>

<!-- DropDown Button -->
<div class="relative" bind:this={dropdownRef}>
	<button
		class="flex items-center gap-0.5 rounded py-[7px] hover:text-blue-500"
		on:click={toggleDropdown}
		aria-label="Heading Level"
	>
		<span class="text-[12px] font-medium">
			{#if activeLevel}
				<FontAwesomeIcon icon={faHeading} class="text-sm mr-[1px]"/>{activeLevel}
			{:else}
				<FontAwesomeIcon icon={faHeading} class="text-sm"/>
			{/if}
		</span>
		<FontAwesomeIcon icon={faChevronDown} class="text-[8px]" />
	</button>

	{#if open}
		<div
			class="absolute top-full left-0 z-30 mt-2 w-fit rounded border border-gray-200 bg-white shadow"
		>
			{#each levels as level}
				<button
					class="w-full flex items-center px-2 gap-[1px] py-2 text-[12px] font-medium hover:bg-blue-50 {activeLevel === level
						? 'bg-blue-100 font-semibold'
						: ''}"
					on:click={() => setHeading(level)}
				>
					<FontAwesomeIcon icon={faHeading} class="text-sm"/> {level}
				</button>
			{/each}
		</div>
	{/if}
</div>
