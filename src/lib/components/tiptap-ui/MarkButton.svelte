<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';

  import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough as StrikeIcon,
  } from 'lucide-svelte';

  export let type: 'bold' | 'italic' | 'underline' | 'strike';
  let currentEditor: Editor | null = null;
  let isActive = false;

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;
    updateActive();
    currentEditor?.on('selectionUpdate', updateActive);
    currentEditor?.on('transaction', updateActive);
  });

  function updateActive() {
    if (!currentEditor) return;
    isActive = currentEditor.isActive(type);
  }

  function toggleMark() {
    if (!currentEditor) return;
    const chain = currentEditor.chain().focus();
    switch (type) {
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'underline':
        chain.toggleUnderline().run();
        break;
      case 'strike':
        chain.toggleStrike().run();
        break;
    }
    updateActive();
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onDestroy(() => {
    unsubscribe();
    currentEditor?.off('selectionUpdate', updateActive);
    currentEditor?.off('transaction', updateActive);
  });
</script>

<button
  class="p-1 rounded hover:text-blue-500 {isActive ? 'text-blue-600' : ''}"
  aria-label={`Toggle ${type}`}
  on:click={toggleMark}
>
  {#if type === 'bold'}
    <Bold size="18" />
  {:else if type === 'italic'}
    <Italic size="18" />
  {:else if type === 'underline'}
    <UnderlineIcon size="18" />
  {:else if type === 'strike'}
    <StrikeIcon size="18" />
  {/if}
</button>
