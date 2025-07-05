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
	import HeadingDropdownMenu from './TiptapComponent/HeadingDropdownMenu.svelte';
	import ListDropdown from './TiptapComponent/ListDropdown.svelte';
	import { ResizableImage } from './TiptapComponent/ResizeImage';
	import { toast } from '@zerodevx/svelte-toast';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { Undo2, Redo2, Bold, Italic, UnderlineIcon } from 'lucide-svelte';
	import {
		faAlignCenter,
		faAlignJustify,
		faAlignLeft,
		faAlignRight,
		faCode,
		faFloppyDisk,
		faImage,
		faImages,
		faQuoteRight
	} from '@fortawesome/free-solid-svg-icons';
	import { ImageBlockNode } from './TiptapComponent/ImageBlock';
	import DragHandle from '@tiptap/extension-drag-handle';
	import { TextBlockNode } from './TiptapComponent/TextBlock';
	import { convertHTMLToBlockContent } from './TiptapComponent/convertHTMLtoBlockContent';

	export let content = '';
	export let onUpdate: (html: string) => void;
	export let title: string = '';
	export let onTitleChange: (value: string) => void = () => {};
	export let onSave: () => void = () => {};
	export let onInsertImage: (file: File) => Promise<string> = async () => '';

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
				StarterKit.configure({
					bulletList: {},
					orderedList: {},
					listItem: {}
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph'] // elemen yang bisa diatur align-nya
				}),
				TaskList,
				Highlight,
				TaskItem.configure({ nested: true }),
				Underline,
				Link.configure({ openOnClick: false }),
				ResizableImage,
				DragHandle,
				TextBlockNode,
				ImageBlockNode,
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
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function action(cmd: () => void) {
		editor?.chain().focus();
		cmd();
	}

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

	function insertImageBlock() {
		editor
			?.chain()
			.focus()
			.insertContent({
				type: 'imageBlock',
				attrs: {
					src: 'https://source.unsplash.com/random/800x400',
					alt: 'Contoh gambar'
				}
			})
			.run();
	}

	function insertTextBlock() {
		editor
			?.chain()
			.focus()
			.insertContent({
				type: 'textBlock',
				attrs: { background: '#fef3c7' }
			})
			.run();
	}
</script>

<div class="relative flex h-[80vh] w-full flex-col overflow-hidden rounded-2xl">
	<!-- Wrapper dengan padding seperti editor -->
	<div class="top-0 z-10 w-full bg-gray-300 px-5">
		<div class="flex flex-wrap justify-center gap-6 rounded-t-xl bg-gray-300 p-2 text-sm">
			<div class="flex gap-2">
				<button
					on:click={() => editor.chain().focus().undo().run()}
					class="rounded py-1 text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="undo"><Undo2 size="17" /></button
				>
				<button
					on:click={() => editor.chain().focus().redo().run()}
					class="rounded py-1 text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="redo"><Redo2 size="17" /></button
				>
			</div>
			<div class="flex gap-2">
				<button
					on:click={() => editor.chain().focus().toggleBold().run()}
					aria-label="Bold"
					class="rounded hover:cursor-pointer hover:text-blue-500"
					><Bold size="17" strokeWidth="2.3" /></button
				>
				<button
					on:click={() => editor.chain().focus().toggleItalic().run()}
					aria-label="Italic"
					class="rounded hover:cursor-pointer hover:text-blue-500"
					><Italic size="17" strokeWidth="2.3" /></button
				>
				<button
					on:click={() => editor.chain().focus().toggleUnderline().run()}
					aria-label="underline"
					class="rounded hover:cursor-pointer hover:text-blue-500"
					><UnderlineIcon size="17" strokeWidth="2.3" /></button
				>
			</div>
			<div class="flex gap-2">
				<HeadingDropdownMenu {editor} />
				<ListDropdown {editor} />
			</div>
			<div class="flex gap-3">
				<button
					on:click={() => editor.chain().focus().toggleBlockquote().run()}
					class="text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="Quotes"><FontAwesomeIcon icon={faQuoteRight} /></button
				>
				<button
					on:click={() => editor.chain().focus().toggleCodeBlock().run()}
					class="text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="Code Box"><FontAwesomeIcon icon={faCode} /></button
				>
			</div>
			<div class="flex gap-2">
				<button
					on:click={() => editor.chain().focus().setTextAlign('left').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Left"
				>
					<FontAwesomeIcon icon={faAlignLeft} />
				</button>

				<button
					on:click={() => editor.chain().focus().setTextAlign('center').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Center"
				>
					<FontAwesomeIcon icon={faAlignCenter} />
				</button>

				<button
					on:click={() => editor.chain().focus().setTextAlign('right').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Right"
				>
					<FontAwesomeIcon icon={faAlignRight} />
				</button>

				<button
					on:click={() => editor.chain().focus().setTextAlign('justify').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Justify"
				>
					<FontAwesomeIcon icon={faAlignJustify} />
				</button>
			</div>
			<!-- Tombol Insert Image -->
			<button
				on:click={insertImage}
				class="rounded hover:cursor-pointer hover:text-blue-500"
				aria-label="Insert Image"
			>
				<FontAwesomeIcon icon={faImage} class="text-base" />
			</button>
			<button
				type="button"
				class="rounded text-sm text-black hover:cursor-pointer hover:text-blue-600"
				aria-label="Featured Image"
			>
				<FontAwesomeIcon icon={faImages} class="text-base" />
			</button>
			<button
				on:click={onSave}
				class="rounded hover:cursor-pointer hover:text-blue-500"
				aria-label="Save"
			>
				<FontAwesomeIcon icon={faFloppyDisk} class="text-base" />
			</button>
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
		<button
			on:click={insertImageBlock}
			class="rounded hover:cursor-pointer hover:text-blue-500"
			aria-label="Insert Image Block"
		>
			📷 Block
		</button>
		<button
			on:click={insertTextBlock}
			class="rounded hover:cursor-pointer hover:text-blue-500"
			aria-label="Insert Image Block"
		>
			📷 Block
		</button>
	</div>
</div>
