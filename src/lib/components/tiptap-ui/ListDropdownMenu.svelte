<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onMount, onDestroy } from 'svelte';
  import { faChevronDown, faListOl, faListUl, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  let dropdownRef: HTMLElement;
  let open = false;
  let currentEditor: any = null;
  let activeType: string | null = null;

  const types = [
    { type: 'bulletList', icon: faListUl, label: 'Bullet' },
    { type: 'orderedList', icon: faListOl, label: 'Numbered' },
    { type: 'taskList', icon: faSquareCheck, label: 'Checklist' }
  ];

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;
    updateActive();
  });

  function toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    open = !open;
  }

  function updateActive() {
    if (!currentEditor) return;
    activeType = types.find((t) => currentEditor.isActive(t.type))?.type ?? null;
  }

  function selectType(type: string) {
    if (!currentEditor) return;

    const chain = currentEditor.chain().focus();

    if (type === 'bulletList') chain.toggleBulletList().run();
    if (type === 'orderedList') chain.toggleOrderedList().run();
    if (type === 'taskList') chain.toggleTaskList().run();

    updateActive();
    open = false;
  }

  function handleClickOutside(event: MouseEvent) {
    if (open && dropdownRef && !dropdownRef.contains(event.target as Node)) {
      open = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    if (currentEditor) {
      currentEditor.on('selectionUpdate', updateActive);
      currentEditor.on('transaction', updateActive);
    }
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    if (currentEditor) {
      currentEditor.off('selectionUpdate', updateActive);
      currentEditor.off('transaction', updateActive);
    }
    unsubscribe();
  });
</script>

<!-- Button Dropdown -->
<div class="relative" bind:this={dropdownRef}>
  <button
    class="flex items-center gap-0.5 py-2 rounded hover:text-blue-500"
    on:click={toggleDropdown}
    aria-label="List Options"
  >
    <FontAwesomeIcon icon={faListUl} />
    <FontAwesomeIcon icon={faChevronDown} class="text-[8px]"/>
  </button>

  {#if open}
    <div class="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded shadow z-30 w-36">
      {#each types as { type, icon, label }}
        <button
          class="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-blue-100 text-left"
          class:selected={activeType === type}
          on:click={() => selectType(type)}
        >
          <FontAwesomeIcon icon={icon} class="text-gray-600" />
          <span>{label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .selected {
    background-color: #dbeafe;
    font-weight: 500;
  }
</style>
