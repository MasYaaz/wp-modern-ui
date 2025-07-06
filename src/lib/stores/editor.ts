// src/lib/stores/editor.ts
import { writable } from 'svelte/store';
import type { Editor } from '@tiptap/core';

export const editor = writable<Editor | null>(null);