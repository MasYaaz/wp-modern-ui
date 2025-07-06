<script lang="ts">
	import { getContext } from 'svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';

	export let updateAttributes: (attrs: Record<string, any>) => void;
	export let node: any;

	// Ambil fungsi upload gambar dari context global
	const onInsertImage = getContext('onInsertImage') as (file: File) => Promise<string>;

	let wrapper: HTMLElement;
	let fileInput: HTMLInputElement;

	function triggerUpload() {
		fileInput.click();
	}

	async function handleUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file || !onInsertImage) return;

		const src = await onInsertImage(file);
		if (src) {
			updateAttributes({ src });
		}
	}

	function handleResize(event: MouseEvent) {
		const startX = event.clientX;
		const startWidth = parseInt(getComputedStyle(wrapper).width, 10);

		function resizeMove(e: MouseEvent) {
			const newWidth = startWidth + (e.clientX - startX);
			updateAttributes({ width: `${newWidth}px` });
		}

		function stopResize() {
			document.removeEventListener('mousemove', resizeMove);
			document.removeEventListener('mouseup', stopResize);
		}

		document.addEventListener('mousemove', resizeMove);
		document.addEventListener('mouseup', stopResize);
	}
</script>

<NodeViewWrapper>
	<div bind:this={wrapper} class="group relative inline-block">
		{#if node.attrs.src}
			<img
				src={node.attrs.src}
				alt=""
				style="width: {node.attrs.width}; height: {node.attrs.height}"
				class="rounded shadow"
			/>
			<button
				type="button"
				class="resizer hidden group-hover:block"
				aria-label="Resize image"
				on:mousedown={handleResize}
				tabindex="0"
			></button>
		{:else}
			<button
				type="button"
				class="w-full cursor-pointer border border-dashed border-gray-400 p-4 text-center"
				on:click={triggerUpload}
			>
				Click to upload image
			</button>
			<input
				type="file"
				accept="image/*"
				bind:this={fileInput}
				on:change={handleUpload}
				class="hidden"
			/>
		{/if}
	</div>
</NodeViewWrapper>

<style>
	.resizer {
		width: 8px;
		height: 100%;
		position: absolute;
		right: 0;
		top: 0;
		cursor: ew-resize;
	}
</style>
