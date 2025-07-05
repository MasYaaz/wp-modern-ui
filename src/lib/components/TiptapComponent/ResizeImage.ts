import { Node, mergeAttributes } from '@tiptap/core';

export const ResizableImage = Node.create({
	name: 'resizableImage',

	inline: false,
	group: 'block',
	draggable: true,
	selectable: true,

	addAttributes() {
		return {
			src: { default: null },
			alt: { default: null },
			title: { default: null },
			width: { default: 'auto' },
			height: { default: 'auto' },
			embedded: { default: false }
		};
	},

	parseHTML() {
		return [
			{
				tag: 'img[data-resizable-image]'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'img',
			mergeAttributes(HTMLAttributes, {
				'data-resizable-image': 'true',
				style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};`
			})
		];
	},

	addNodeView() {
		return ({ node, getPos, editor }) => {
			const outer = document.createElement('span');
			outer.style.position = 'relative';
			outer.style.display = 'inline-block';

			const img = document.createElement('img');
			img.src = node.attrs.src || '';
			img.alt = node.attrs.alt || '';
			img.title = node.attrs.title || '';
			img.style.width = node.attrs.width || 'auto';
			img.style.height = node.attrs.height || 'auto';
			img.style.borderRadius = '4px';
			img.style.maxWidth = '100%';
			img.style.display = 'block';

			outer.appendChild(img);

			// 🌐 Tambahkan badge jika embedded
			if (node.attrs.embedded) {
				const badge = document.createElement('span');
				badge.textContent = '🌐 Embed';
				badge.style.position = 'absolute';
				badge.style.top = '0';
				badge.style.left = '0';
				badge.style.background = 'rgba(0, 0, 0, 0.6)';
				badge.style.color = 'white';
				badge.style.padding = '2px 6px';
				badge.style.fontSize = '10px';
				badge.style.borderRadius = '0 0 4px 0';
				badge.style.zIndex = '10';
				outer.appendChild(badge);
			}

			// ✅ Tambahkan tombol "Set as Featured"
			const btn = document.createElement('button');
			btn.textContent = 'Set Featured';
			btn.style.position = 'absolute';
			btn.style.top = '0';
			btn.style.right = '0';
			btn.style.background = '#2563eb';
			btn.style.color = 'white';
			btn.style.padding = '2px 6px';
			btn.style.fontSize = '10px';
			btn.style.border = 'none';
			btn.style.cursor = 'pointer';
			btn.style.zIndex = '20';
			btn.style.borderRadius = '0 0 0 4px';

			btn.onclick = () => {
				console.log('[✔️] Button clicked. Dispatching set-featured-image event...');
				console.log('📤 Event detail:', node.attrs.src);

				const customEvent = new CustomEvent('set-featured-image', {
					detail: { src: node.attrs.src },
					bubbles: true
				});
				outer.dispatchEvent(customEvent);
			};
			outer.appendChild(btn);

			// ✋ Handle resize kalau bukan embed
			if (!node.attrs.embedded) {
				const handle = document.createElement('span');
				handle.style.position = 'absolute';
				handle.style.bottom = '0';
				handle.style.right = '0';
				handle.style.width = '12px';
				handle.style.height = '12px';
				handle.style.background = 'rgba(0, 0, 0, 0.5)';
				handle.style.cursor = 'nwse-resize';
				handle.style.borderRadius = '50%';
				handle.style.zIndex = '10';

				outer.appendChild(handle);

				let startX = 0;
				let startWidth = 0;

				handle.addEventListener('mousedown', (event) => {
					event.preventDefault();
					event.stopPropagation();

					startX = event.clientX;
					startWidth = img.offsetWidth;

					const onMouseMove = (moveEvent: MouseEvent) => {
						const dx = moveEvent.clientX - startX;
						const newWidth = `${Math.max(50, startWidth + dx)}px`;
						img.style.width = newWidth;

						const pos = getPos?.();
						if (typeof pos === 'number') {
							const transaction = editor.view.state.tr.setNodeMarkup(pos, undefined, {
								...node.attrs,
								width: newWidth,
								height: 'auto'
							});
							editor.view.dispatch(transaction);
						}
					};

					const onMouseUp = () => {
						document.removeEventListener('mousemove', onMouseMove);
						document.removeEventListener('mouseup', onMouseUp);
					};

					document.addEventListener('mousemove', onMouseMove);
					document.addEventListener('mouseup', onMouseUp);
				});
			}

			return {
				dom: outer,
				update(updatedNode) {
					if (updatedNode.type.name !== 'resizableImage') return false;
					img.src = updatedNode.attrs.src || '';
					img.alt = updatedNode.attrs.alt || '';
					img.title = updatedNode.attrs.title || '';
					img.style.width = updatedNode.attrs.width || 'auto';
					img.style.height = updatedNode.attrs.height || 'auto';
					return true;
				}
			};
		};
	}
});
