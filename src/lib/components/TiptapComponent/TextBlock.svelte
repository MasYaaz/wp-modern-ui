<script lang="ts">
	import { NodeViewWrapper, NodeViewContent } from 'svelte-tiptap';

	export let deleteNode;
	export let selected;
</script>

<NodeViewWrapper
	class={`group relative rounded-md p-2 transition 
    ${selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
	contenteditable="true"
	draggable="true"
	data-drag-handle
>
	<!-- Konten teks yang bisa diketik -->
	<NodeViewContent class="min-h-[40px] text-sm text-gray-800 outline-none xl:text-base" />

	<!-- Tombol Hapus -->
	<div
		class="absolute top-1 right-1 flex gap-1 rounded bg-white p-1 opacity-0 shadow transition group-hover:opacity-100"
	>
		<button
			type="button"
			class="text-red-600 hover:text-red-800"
			title="Hapus block"
			on:click={deleteNode}
		>
			🗑
		</button>
	</div>

	<!-- Drag handle -->
	<div
		class="absolute top-1/2 left-[-24px] -translate-y-1/2 cursor-grab text-gray-400 opacity-0 transition group-hover:opacity-100"
		title="Geser blok"
        data-drag-handle
	>
		☰
	</div>
</NodeViewWrapper>
