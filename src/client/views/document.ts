import { defs, g, line, rect, svg } from '../lib/dom/s'
import { attr, strictSelect } from '../lib/dom/util'
import { ScaleTransform, Size } from '../lib/geometry/types'
import { createBackgroundImagePattern } from './background-pattern'
import { createGridPattern } from './grid-pattern'

export const createDocumentEl = () => {
  const svgEl = svg(
    { id: 'document' },
    defs(
      createGridPattern(),
      createBackgroundImagePattern()
    ),
    g(
      { id: 'body' },
      rect({ id: 'grid', fill: 'url(#gridPattern)' }),
      rect({ id: 'backgroundImage', fill: 'url(#backgroundImagePattern)', opacity: 0.75 }),
      g({ id: 'rects' })
    )
  )

  return svgEl
}

export const updateDocumentSize = ({ width, height }: Size) => {
  const svgEl = strictSelect<SVGSVGElement>('#document')

  attr(svgEl, { viewBox: `0 0 ${width} ${height}` })
}

export const updateGridSize = ({ width, height }: Size) => {
  const gridEl = strictSelect<SVGRectElement>('#grid')

  attr(gridEl, { x: 0, y: 0, width, height })
}

export const updateBackgroundImageSize = ( size: Size) => {
  const el = strictSelect<SVGRectElement>('#backgroundImage')

  attr(el, { x: 0, y: 0 }, size )
}

export const updateBodyTransform = ({ x, y, scale }: ScaleTransform) => {
  const bodyEl = strictSelect<SVGGElement>('#body')

  attr(bodyEl, { transform: `translate(${x} ${y}) scale(${scale})` })
}
