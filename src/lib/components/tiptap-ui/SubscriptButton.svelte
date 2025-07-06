<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';
  import { SubscriptIcon } from 'lucide-svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSubscript } from '@fortawesome/free-solid-svg-icons';

  let currentEditor: Editor | null = null;
  let isActive = false;

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;
    updateActive();
    currentEditor?.on('selectionUpdate', updateActive);
    currentEditor?.on('transaction', updateActive);
  });

  function updateActive() {
    isActive = currentEditor?.isActive('subscript') ?? false;
  }

  function toggleSubscript() {
    currentEditor?.chain().focus().toggleSubscript().run();
  }

  onDestroy(() => {
    unsubscribe();
    currentEditor?.off('selectionUpdate', updateActive);
    currentEditor?.off('transaction', updateActive);
  });
</script>

<button
  class="p-1 rounded hover:text-blue-500 {isActive ? 'text-blue-600' : ''}"
  on:click={toggleSubscript}
  aria-label="Subscript"
>
  <FontAwesomeIcon icon={faSubscript} class="text-xs"/>
</button>
