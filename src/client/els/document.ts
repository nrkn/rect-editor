import { defs, g, line, rect, svg } from "../lib/dom/s"
import { createGridPattern } from './grid-pattern'

export const createDocumentEl = () => {
  const svgEl = svg(
    { id: 'document' },
    defs(
      createGridPattern()
    ),
    g(
      { id: 'body' },
      rect({ id: 'grid', fill: 'url(#gridPattern)' }),
      g({ id: 'rects' })
    )
  )

  return svgEl
}
