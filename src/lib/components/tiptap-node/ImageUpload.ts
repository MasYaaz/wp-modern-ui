// src/lib/extensions/ImageUpload.ts
import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import ImageUploadResizableNode from '$lib/components/tiptap-node/ImageUploadResizableNode.svelte';

export const ImageUpload = Node.create({
  name: 'imageUpload',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: 'auto' },
    };
  },

  parseHTML() {
    return [{ tag: 'image-upload' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-upload', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return SvelteNodeViewRenderer(ImageUploadResizableNode as any);
  },
});
