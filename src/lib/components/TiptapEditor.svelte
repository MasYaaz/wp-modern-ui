<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
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

	export let content = '';
	export let onUpdate: (html: string) => void;
	export let title: string = '';
	export let onTitleChange: (value: string) => void = () => {};
	export let onSave: () => void = () => {};
	export let onInsertFeaturedImage: (file: File) => Promise<string> = async () => '';

	let editor: Editor;
	let editorElement: HTMLElement;

	onMount(() => {
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

	function insertFeaturedImage() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';

		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			// Upload gambar lewat callback dari luar
			const src = await onInsertFeaturedImage(file);
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

	function embedImage() {
		const url = prompt('Masukkan URL gambar (embed)');
		if (!url) return;

		editor
			.chain()
			.focus()
			.insertContent({
				type: 'resizableImage',
				attrs: {
					src: url,
					width: '100%',
					height: 'auto',
					embedded: true
				}
			})
			.run();
	}
</script>

<div class="relative flex h-[80vh] w-full flex-col overflow-hidden rounded-2xl">
	<!-- Wrapper dengan padding seperti editor -->
	<div class="top-0 z-10 w-full bg-gray-300 px-5 lg:px-30 xl:px-60">
		<div class="flex flex-wrap justify-center gap-6 rounded-t-xl bg-gray-300 p-2 text-sm lg:gap-8">
			<div class="flex gap-3 lg:gap-5">
				<button
					on:click={() => editor.chain().focus().undo().run()}
					class="rounded py-1 text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="undo"><i class="fas fa-rotate-left rotate-45"></i></button
				>
				<button
					on:click={() => editor.chain().focus().redo().run()}
					class="rounded py-1 text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="redo"><i class="fas fa-rotate-right -rotate-45"></i></button
				>
			</div>
			<div class="flex gap-3 lg:gap-5">
				<button
					on:click={() => editor.chain().focus().toggleBold().run()}
					aria-label="Bold"
					class="rounded hover:cursor-pointer hover:text-blue-500"
					><i class="fas fa-bold text-base"></i></button
				>
				<button
					on:click={() => editor.chain().focus().toggleItalic().run()}
					aria-label="Italic"
					class="rounded hover:cursor-pointer hover:text-blue-500"
					><i class="fas fa-italic text-base"></i></button
				>
				<button
					on:click={() => editor.chain().focus().toggleUnderline().run()}
					aria-label="underline"
					class="rounded hover:cursor-pointer hover:text-blue-500"
					><i class="fas fa-underline text-base"></i></button
				>
			</div>
			<div class="flex gap-2 lg:gap-5">
				<HeadingDropdownMenu {editor} />
				<ListDropdown {editor} />
			</div>
			<div class="flex gap-3 lg:gap-5">
				<button
					on:click={() => editor.chain().focus().toggleBlockquote().run()}
					class="text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="Quotes"><i class="fas fa-quote-right"></i></button
				>
				<button
					on:click={() => editor.chain().focus().toggleCodeBlock().run()}
					class="text-sm font-medium hover:cursor-pointer hover:text-blue-500"
					aria-label="Code Box"><i class="fas fa-code"></i></button
				>
			</div>
			<div class="flex gap-5">
				<button
					on:click={() => editor.chain().focus().setTextAlign('left').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Left"
				>
					<i class="fas fa-align-left text-base"></i>
				</button>

				<button
					on:click={() => editor.chain().focus().setTextAlign('center').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Center"
				>
					<i class="fas fa-align-center text-base"></i>
				</button>

				<button
					on:click={() => editor.chain().focus().setTextAlign('right').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Right"
				>
					<i class="fas fa-align-right text-base"></i>
				</button>

				<button
					on:click={() => editor.chain().focus().setTextAlign('justify').run()}
					class="rounded hover:cursor-pointer hover:text-blue-500"
					aria-label="Align Justify"
				>
					<i class="fas fa-align-justify text-base"></i>
				</button>
			</div>
			<!-- Tombol Insert Image -->
			<button
				on:click={insertFeaturedImage}
				class="rounded hover:cursor-pointer hover:text-blue-500"
				aria-label="Insert Image"
			>
				<i class="fas fa-image text-base"></i>
			</button>
			<button
				type="button"
				class="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
				on:click={embedImage}
			>
				🌐 Embed Image
			</button>
			<button
				on:click={onSave}
				class="rounded hover:cursor-pointer hover:text-blue-500"
				aria-label="Save"
			>
				<i class="fas fa-floppy-disk text-base"></i>
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
	</div>
</div>
