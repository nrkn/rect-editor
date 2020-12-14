import { defs, g, line, rect, svg } from '../lib/dom/s'
import { attr, strictSelect } from '../lib/dom/util'
import { ScaleTransform, Size } from '../lib/geometry/types'
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

export const updateDocumentSize = ({ width, height }: Size) => {
  const svgEl = strictSelect<SVGSVGElement>('#document')

  attr(svgEl, { viewBox: `0 0 ${width} ${height}` })
}

export const updateGrid = ({ width, height }: Size) => {
  const gridEl = strictSelect<SVGRectElement>('#grid')

  attr(gridEl, { x: 0, y: 0, width, height })
}


export const updateBodyTransform = ({ x, y, scale }: ScaleTransform) => {
  const bodyEl = strictSelect<SVGGElement>('#body')

  attr(bodyEl, { transform: `translate(${x} ${y}) scale(${scale})` })
}