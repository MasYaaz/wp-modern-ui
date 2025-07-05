<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import type { Node as ProseMirrorNode } from 'prosemirror-model';
	import { NodeViewWrapper } from 'svelte-tiptap';

	export let node: ProseMirrorNode;
	export let deleteNode: () => void;
	export let selected: boolean;

	function onDelete() {
		deleteNode();
	}
</script>

<NodeViewWrapper
	class={`group relative rounded-md p-2 transition 
    ${selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
	contenteditable="false"
	draggable="true"
	data-drag-handle
>
	<img src={node.attrs.src} alt={node.attrs.alt} class="w-full rounded-md object-cover" />

	<!-- Toolbar hanya muncul saat hover -->
	<div
		class="absolute top-1 right-1 flex gap-1 rounded bg-transparent p-1 opacity-0 shadow transition group-hover:opacity-100"
	>
		<button
			type="button"
			class="text-red-600 hover:text-red-800"
			title="Hapus gambar"
			on:click={onDelete}
		>
			🗑
		</button>
	</div>

	<!-- Drag handle -->
	<div
		class="absolute top-1/2 left-[-24px] -translate-y-1/2 cursor-grab text-gray-400 opacity-0 transition group-hover:opacity-100"
		title="Geser blok"
	>
		☰
	</div>
</NodeViewWrapper>
