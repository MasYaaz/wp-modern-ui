<script lang="ts">
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { onInsertImage } from '$lib/stores/editor';

	export let node: any;
	export let editor: any;
	export let getPos: () => number;

	let insertImage: (file: File) => Promise<{ src: string; id: number }>;
	onInsertImage.subscribe((fn) => (insertImage = fn));

	let wrapper: HTMLElement;
	let fileInput: HTMLInputElement;

	function triggerUpload() {
		fileInput.click();
	}

	async function handleUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0]; // ⬅️ pastikan ini ada

		if (!file || !insertImage) return;

		const result = await insertImage(file); // ⬅️ ini sekarang sudah valid
		if (!result || !result.src) return;

		const pos = getPos?.();
		if (typeof pos === 'number') {
			const node = editor.schema.nodes.resizableImage.create({
				src: result.src,
				width: 'auto',
				height: 'auto'
			});

			const tr = editor.state.tr.replaceWith(
				pos,
				pos + (editor.state.doc.nodeAt(pos)?.nodeSize || 1),
				node
			);
			editor.view.dispatch(tr);
		}
	}

	function cancelNode() {
		const pos = getPos?.();
		if (typeof pos === 'number') {
			const tr = editor.view.state.tr.delete(pos, pos + node.nodeSize);
			editor.view.dispatch(tr);
		}
	}
</script>

<NodeViewWrapper>
	<div
		bind:this={wrapper}
		class="flex flex-col items-center gap-2 border border-dashed border-gray-400 p-4 text-center"
	>
		<button
			type="button"
			class="w-full cursor-pointer border border-dashed border-gray-400 px-4 py-2 text-sm"
			on:click={triggerUpload}
		>
			Click to upload image
		</button>

		<button type="button" class="text-xs text-gray-500 underline" on:click={cancelNode}>
			Cancel
		</button>

		<input
			type="file"
			accept="image/*"
			bind:this={fileInput}
			on:change={handleUpload}
			class="hidden"
		/>
	</div>
</NodeViewWrapper>
