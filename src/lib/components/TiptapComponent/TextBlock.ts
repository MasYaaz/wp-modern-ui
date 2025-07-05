import { Node, mergeAttributes } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'svelte-tiptap'
import TextBlock from '$lib/components/TiptapComponent/TextBlock.svelte'

export const TextBlockNode = Node.create({
  name: 'textBlock',
  group: 'block',
  content: 'inline*',
  atom: false, // user bisa edit teks
  draggable: true,

  addAttributes() {
    return {
      background: { default: '#fef3c7' },
    }
  },

  parseHTML() {
    return [{ tag: 'text-block' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['text-block', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return SvelteNodeViewRenderer(TextBlock as any)
  }
})
