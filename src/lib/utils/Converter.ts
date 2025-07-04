export function convertGutenbergImagesToResizable(html: string): string {
	return html.replace(
		/<img([^>]+)>/g,
		(_, attrs) => {
			// Jangan konversi ulang jika sudah ada data-resizable-image
			if (attrs.includes('data-resizable-image')) return `<img${attrs}>`;

			// Tambahkan atribut untuk ResizableImage
			const width = /width="([^"]+)"/.exec(attrs)?.[1] || '300px';
			const height = /height="([^"]+)"/.exec(attrs)?.[1] || 'auto';

			return `<img${attrs} data-resizable-image="true" width="${width}" height="${height}">`;
		}
	);
}
