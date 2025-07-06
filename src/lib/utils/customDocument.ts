import { Document } from '@tiptap/extension-document'
import { Node } from '@tiptap/core'

// Buat CustomDocument yang hanya membolehkan node apa pun di awal, tanpa default <p>
export const CustomDocument = Document.extend({
  content: 'block+',
})
