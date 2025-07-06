<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCode } from '@fortawesome/free-solid-svg-icons';
  import type { Editor } from '@tiptap/core';

  let currentEditor: Editor | null = null;
  let isActive = false;

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;
    updateActive();
    currentEditor?.on('selectionUpdate', updateActive);
    currentEditor?.on('transaction', updateActive);
  });

  function updateActive() {
    isActive = currentEditor?.isActive('codeBlock') ?? false;
  }

  function toggleCodeBlock() {
    currentEditor?.chain().focus().toggleCodeBlock().run();
  }

  onDestroy(() => {
    unsubscribe();
    currentEditor?.off('selectionUpdate', updateActive);
    currentEditor?.off('transaction', updateActive);
  });
</script>

<button
  class="p-1 rounded hover:text-blue-500 {isActive ? 'text-blue-600' : ''}"
  on:click={toggleCodeBlock}
  aria-label="Code Block"
>
  <FontAwesomeIcon icon={faCode} />
</button>
