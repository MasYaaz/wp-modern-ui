<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import TaskList from '@tiptap/extension-task-list';
	import TaskItem from '@tiptap/extension-task-item';
	import TextAlign from '@tiptap/extension-text-align';
	import Highlight from '@tiptap/extension-highlight';
	import HeadingDropdownMenu from './tiptap-ui/HeadingDropdownMenu.svelte';
	import ListDropdown from './tiptap-ui/ListDropdownMenu.svelte';
	import { ResizableImage } from './TiptapComponent/ResizeImage';
	import { toast } from '@zerodevx/svelte-toast';
	import DragHandle from '@tiptap/extension-drag-handle';
	import UndoRedoButton from './tiptap-ui/UndoRedoButton.svelte';
	import MarkButton from './tiptap-ui/MarkButton.svelte';
	import BlockquoteButton from './tiptap-ui/BlockquoteButton.svelte';
	import CodeBlockButton from './tiptap-ui/CodeBlockButton.svelte';
	import ImageInsertButton from './tiptap-ui/ImageInsertButton.svelte';
	import FeaturedImageButton from './tiptap-ui/FeaturedImageButton.svelte';
	import SaveButton from './tiptap-ui/SaveButton.svelte';
	import TextAlignButton from './tiptap-ui/TextAlignButton.svelte';
	import ColorHighlightPopover from './tiptap-ui/ColorHighlightPopover.svelte';
	import Superscript from '@tiptap/extension-superscript';
	import Subscript from '@tiptap/extension-subscript';
	import { editor as editorStore } from '$lib/stores/editor';
	import SuperscriptButton from './tiptap-ui/SuperscriptButton.svelte';
	import SubscriptButton from './tiptap-ui/SubscriptButton.svelte';
	import { CustomDocument } from '$lib/utils/customDocument';
	import { ImageUpload } from './tiptap-node/ImageUpload';
	import { setContext } from 'svelte';

	export let content = '';
	export let onUpdate: (html: string) => void;
	export let title: string = '';
	export let onTitleChange: (value: string) => void = () => {};
	export let onSave: () => void = () => {};

	export let onInsertImage: (file: File) => Promise<string> = async () => '';
	setContext('onInsertImage', onInsertImage);

	let editor: Editor;
	let editorElement: HTMLElement;

	let featuredImage = '';
	let featuredImageId: number | null = null; // ID bisa tetap null kalau hanya pakai URL

	onMount(() => {
		editorElement?.addEventListener('set-featured-image', (event: Event) => {
			const customEvent = event as CustomEvent;
			handleSetFeaturedImage(customEvent);
		});

		editor = new Editor({
			element: editorElement,
			extensions: [
				CustomDocument,
				StarterKit.configure({
					document: false,
					bulletList: {},
					orderedList: {},
					listItem: {}
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph'] // elemen yang bisa diatur align-nya
				}),
				TaskList,
				Highlight.configure({
					multicolor: true
				}),
				TaskItem.configure({ nested: true }),
				Underline,
				Link.configure({ openOnClick: false }),
				ResizableImage,
				ImageUpload,
				DragHandle,
				Superscript,
				Subscript,
				Image.configure({
					inline: false,
					HTMLAttributes: {
						class: 'resizable rounded-shadow'
					}
				})
			],
			content,
			editorProps: {
				attributes: {
					spellcheck: 'false',
					class: 'prose max-w-none min-h-[250px] focus:outline-none px-4 py-3'
				}
			},
			onUpdate({ editor }) {
				onUpdate?.(editor.getHTML());
			}
		});
		editorStore.set(editor);
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function insertImage() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';

		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			// Upload gambar lewat callback dari luar
			const src = await onInsertImage(file);
			if (!src) return;

			// Masukkan ke editor
			editor
				.chain()
				.focus()
				.insertContent({
					type: 'resizableImage',
					attrs: {
						src,
						width: '1000px',
						height: 'auto'
					}
				})
				.run();
		};

		input.click();
	}

	function handleSetFeaturedImage(event: CustomEvent) {
		const src = event.detail?.src;
		if (!src) return;

		featuredImage = src;
		featuredImageId = null; // opsional: bisa diganti jika tahu ID-nya

		toast.push('✅ Gambar ini diset sebagai Featured Image!', {
			theme: {
				'--toastBackground': '#2563eb',
				'--toastColor': 'white',
				'--toastBarBackground': 'white'
			}
		});
	}
</script>

<div class="relative flex h-[80vh] w-full flex-col overflow-hidden rounded-2xl">
	<!-- Wrapper dengan padding seperti editor -->
	<div class="top-0 z-10 flex w-full items-center justify-center bg-gray-300 px-5">
		<div class="flex flex-wrap items-center gap-3 rounded-t-xl bg-gray-300 p-2 text-sm">
			<div class="flex gap-2">
				<UndoRedoButton action="undo" />
				<UndoRedoButton action="redo" />
			</div>
			<div class="mx-2 h-6 w-[1.2px] bg-gray-500"></div>
			<div class="flex gap-2">
				<MarkButton type="bold" />
				<MarkButton type="strike" />
				<MarkButton type="italic" />
				<MarkButton type="underline" />
			</div>
			<div class="mx-2 h-6 w-[1.2px] bg-gray-500"></div>
			<div class="flex gap-2">
				<HeadingDropdownMenu />
				<ListDropdown />
			</div>
			<div class="mx-2 h-6 w-[1.2px] bg-gray-500"></div>
			<div class="flex gap-3">
				<BlockquoteButton />
				<CodeBlockButton />
				<ColorHighlightPopover />
			</div>
			<div class="mx-2 h-6 w-[1.2px] bg-gray-500"></div>
			<div class="flex gap-2">
				<TextAlignButton align="left" />
				<TextAlignButton align="center" />
				<TextAlignButton align="right" />
				<TextAlignButton align="justify" />
			</div>
			<div class="mx-2 h-6 w-[1.2px] bg-gray-500"></div>
			<div class="flex gap-2">
				<SuperscriptButton />
				<SubscriptButton />
			</div>
			<div class="mx-2 h-6 w-[1.2px] bg-gray-500"></div>
			<ImageInsertButton />
			<FeaturedImageButton />
			<SaveButton {onSave} />
		</div>
	</div>
	<div
		bind:this={editorElement}
		class="flex-1 overflow-y-auto bg-white px-5 py-5 lg:px-30 lg:py-10 xl:px-60 xl:py-20"
	>
		<input
			type="text"
			bind:value={title}
			on:input={(e) => onTitleChange((e.target as HTMLInputElement).value)}
			placeholder="Judul artikel..."
			class="mb-3 w-full border-b border-gray-300 px-4 py-2 text-2xl leading-tight font-bold focus:outline-none md:text-3xl lg:text-4xl"
			spellcheck="false"
		/>
	</div>
</div>
