<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';

  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import {
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
  } from '@fortawesome/free-solid-svg-icons';

  export let align: 'left' | 'center' | 'right' | 'justify';

  let currentEditor: Editor | null = null;
  let isActive = false;

  const icons = {
    left: faAlignLeft,
    center: faAlignCenter,
    right: faAlignRight,
    justify: faAlignJustify,
  };

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;
    updateActive();
    currentEditor?.on('selectionUpdate', updateActive);
    currentEditor?.on('transaction', updateActive);
  });

  function updateActive() {
    if (!currentEditor) return;
    isActive = currentEditor.isActive({ textAlign: align });
  }

  function applyAlign() {
    currentEditor?.chain().focus().setTextAlign(align).run();
  }

  onDestroy(() => {
    unsubscribe();
    currentEditor?.off('selectionUpdate', updateActive);
    currentEditor?.off('transaction', updateActive);
  });
</script>

<button
  on:click={applyAlign}
  class="p-1 rounded hover:text-blue-500 {isActive ? 'text-blue-600' : ''}"
  aria-label="Align {align}"
>
  <FontAwesomeIcon icon={icons[align]} />
</button>
