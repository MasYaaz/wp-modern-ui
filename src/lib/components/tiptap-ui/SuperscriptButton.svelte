<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';
  import { SuperscriptIcon } from 'lucide-svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSuperscript } from '@fortawesome/free-solid-svg-icons';

  let currentEditor: Editor | null = null;
  let isActive = false;

  let cleanupFns: (() => void)[] = [];

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;

    // Hapus listener sebelumnya
    cleanupFns.forEach(fn => fn());
    cleanupFns = [];

    if (currentEditor) {
      const update = () => {
        isActive = currentEditor?.isActive('superscript') ?? false;
      };

      currentEditor.on('selectionUpdate', update);
      currentEditor.on('transaction', update);

      cleanupFns.push(() => currentEditor?.off('selectionUpdate', update));
      cleanupFns.push(() => currentEditor?.off('transaction', update));

      update();
    }
  });

  function toggleSuperscript() {
    if (!currentEditor) return;

    if (isActive) {
      currentEditor.chain().focus().unsetSuperscript().run();
    } else {
      currentEditor.chain().focus().setSuperscript().run();
    }
  }

  onDestroy(() => {
    unsubscribe();
    cleanupFns.forEach(fn => fn());
  });
</script>

<button
  class="p-1 rounded hover:text-blue-500"
  class:text-blue-600={isActive}
  on:click={toggleSuperscript}
  aria-label="Superscript"
>
  <FontAwesomeIcon icon={faSuperscript} class="text-xs"/>
</button>
