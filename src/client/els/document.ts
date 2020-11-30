import { defs, g, rect, svg } from "../lib/dom/s"

export const createDocumentEl = () => {
  const svgEl = svg(
    { id: 'document' },
    defs(),
    g(
      { id: 'body' },
      rect({ id: 'grid', fill: '#ddd' }),
      g({ id: 'rects' })
    )
  )

  return svgEl
}
