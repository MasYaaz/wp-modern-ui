<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';
  import { Undo2, Redo2 } from 'lucide-svelte';

  export let action: 'undo' | 'redo' = 'undo';

  let currentEditor: Editor | null = null;

  const unsubscribe = editor.subscribe((value) => {
    currentEditor = value;
  });

  onDestroy(() => {
    unsubscribe();
  });

  function handleClick() {
    if (!currentEditor) return;
    const chain = currentEditor.chain().focus();
    if (action === 'undo') chain.undo().run();
    else if (action === 'redo') chain.redo().run();
  }
</script>

<button
	on:click={handleClick}
	aria-label={action}
	class="rounded py-1 text-sm font-medium hover:text-blue-500"
>
	{#if action === 'undo'}
		<Undo2 size="17" />
	{:else}
		<Redo2 size="17" />
	{/if}
</button>
