export function convertHTMLToBlockContent(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const nodes: any[] = []

  Array.from(doc.body.childNodes).forEach((el) => {
    if (el.nodeType === 3) {
      // text node langsung
      if (el.textContent?.trim()) {
        nodes.push({
          type: 'textBlock',
          content: [{ type: 'text', text: el.textContent.trim() }],
        })
      }
      return
    }

    if (!(el instanceof HTMLElement)) return

    if (el.tagName === 'P' && el.textContent?.trim()) {
      nodes.push({
        type: 'textBlock',
        content: el.innerHTML
          ? [{ type: 'text', text: el.textContent }]
          : [],
      })
    }

    if (el.tagName === 'IMG') {
      nodes.push({
        type: 'imageBlock',
        attrs: {
          src: el.getAttribute('src'),
          alt: el.getAttribute('alt') || '',
        },
      })
    }

    // Optional: heading atau blockquote
    if (el.tagName === 'H2' || el.tagName === 'H3') {
      nodes.push({
        type: 'textBlock',
        content: [{ type: 'text', text: el.textContent || '' }],
      })
    }
  })

  return { type: 'doc', content: nodes }
}
