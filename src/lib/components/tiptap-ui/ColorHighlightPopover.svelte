<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy, afterUpdate } from 'svelte';
  import { HighlighterIcon } from 'lucide-svelte';
  import type { Editor } from '@tiptap/core';

  let currentEditor: Editor | null = null;
  let open = false;
  let dropdownRef: HTMLElement;
  let selectedColor: string | null = null;

  const colors = ['#fef08a', '#fca5a5', '#a5f3fc', '#c4b5fd', '#fcd34d'];

  const unsubscribe = editor.subscribe(value => {
    currentEditor = value;
    updateSelectedColor();
  });

  function updateSelectedColor() {
    if (!currentEditor) return;
    for (const color of colors) {
      if (currentEditor.isActive('highlight', { color })) {
        selectedColor = color;
        return;
      }
    }
    selectedColor = null;
  }

  function applyColor(color: string) {
    if (!currentEditor) return;

    const isActive = currentEditor.isActive('highlight', { color });

    if (isActive) {
      currentEditor.chain().focus().unsetHighlight().run();
    } else {
      currentEditor.chain().focus().setHighlight({ color }).run();
    }

    updateSelectedColor();
    open = false;
  }

  function toggleDropdown(e: MouseEvent) {
    e.stopPropagation();
    open = !open;
    if (open) updateSelectedColor();
  }

  function handleClickOutside(event: MouseEvent) {
    if (open && dropdownRef && !dropdownRef.contains(event.target as Node)) {
      open = false;
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
    onDestroy(() => {
      window.removeEventListener('click', handleClickOutside);
      unsubscribe();
    });
  }
</script>

<!-- UI -->
<div class="relative" bind:this={dropdownRef}>
  <button
    class="rounded py-[6px] hover:text-blue-500"
    aria-label="Highlight"
    on:click={toggleDropdown}
  >
    <HighlighterIcon size="18" />
  </button>

  {#if open}
    <div class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded shadow z-20">
      <div class="flex gap-1 p-2">
        {#each colors as color}
          <button
            class="w-5 h-5 rounded border border-gray-300 hover:scale-105"
            style="background-color: {color}"
            class:selected={selectedColor === color}
            on:click={() => applyColor(color)}
            aria-label={`Highlight ${color}`}
          ></button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  button.selected {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }
</style>
