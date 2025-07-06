import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import ImageUploadResizableNode from '$lib/components/tiptap-node/ImageUploadResizableNode.svelte';

export interface ResizableImageUploadOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImageUpload: {
      insertImage: (options: { src: string; width?: string; height?: string }) => ReturnType
    }
  }
}

export const ResizableImageUpload = Node.create<ResizableImageUploadOptions>({
  name: 'resizableImageUpload',

  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: 'auto' },
    }
  },

  parseHTML() {
    return [{ tag: 'resizable-image-upload' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['resizable-image-upload', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return SvelteNodeViewRenderer(ImageUploadResizableNode as any);
  },

  addCommands() {
    return {
      insertImage: (attrs) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs,
        });
      },
    }
  },
});
