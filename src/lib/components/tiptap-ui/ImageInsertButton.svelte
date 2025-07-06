<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import { faPlus } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';

  let currentEditor: Editor | null = null;
  const unsubscribe = editor.subscribe((value) => (currentEditor = value));
  onDestroy(() => unsubscribe());

  function insertUploadNode() {
    currentEditor?.chain().focus().insertContent({ type: 'imageUpload' }).run();
  }
</script>

<button
  class="rounded p-1 hover:text-blue-500"
  aria-label="Insert Upload Block"
  on:click={insertUploadNode}
>
  <FontAwesomeIcon icon={faPlus} />
</button>
