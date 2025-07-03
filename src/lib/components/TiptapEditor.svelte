<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import Blockquote from '@tiptap/extension-blockquote';
	import CodeBlock from '@tiptap/extension-code-block';
	import TaskList from '@tiptap/extension-task-list';
	import TaskItem from '@tiptap/extension-task-item';
	import HeadingDropdownMenu from './TiptapComponent/HeadingDropdownMenu.svelte';
	import ListDropdown from './TiptapComponent/ListDropdown.svelte';
	export let content = '';
	export let onUpdate: (html: string) => void;

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
				TaskList,
				TaskItem.configure({ nested: true }),
				Underline,
				Image,
				Link.configure({ openOnClick: false }),
				Blockquote,
				CodeBlock
			],
			content,
			editorProps: {
				attributes: {
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
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-wrap gap-8 rounded-t-xl p-2 text-sm">
		<div class="flex gap-5">
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
		<div class="flex gap-5">
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
		<HeadingDropdownMenu {editor} />

		<ListDropdown {editor} />

		<button
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium hover:bg-gray-100"
			>Quote</button
		>
		<button
			on:click={() => editor.chain().focus().toggleCodeBlock().run()}
			class="rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium hover:bg-gray-100"
			>Code</button
		>
	</div>
	<div
		bind:this={editorElement}
		class="bg-white px-5 py-5 lg:px-30 lg:py-15 xl:px-60 xl:py-30"
	></div>
</div>
