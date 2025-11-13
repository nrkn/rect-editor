import { line, pattern, rect } from '../lib/dom/s'
import { attr, strictSelect } from '../lib/dom/util'
import { Line, Rect, Size } from '../lib/geometry/types'

export const createGridPattern = () =>
  pattern(
    { id: 'gridPattern', patternUnits: "userSpaceOnUse" },
    rect({ fill: '#eee' }),
    line({ stroke: '#39f' }),
    line({ stroke: '#39f' })
  )

export const updateGridPattern = (
  { width, height }: Size,
  gridPatternEl: SVGPatternElement = strictSelect<SVGPatternElement>('#gridPattern')
) => {
  const bgRectEl = strictSelect('rect', gridPatternEl)
  const [vertLineEl, horizLineEl] = gridPatternEl.querySelectorAll('line')

  const bgRect: Rect = { x: 0, y: 0, width, height }
  const vertLine: Line = { x1: 0, y1: 0, x2: 0, y2: height }
  const horizLine: Line = { x1: 0, y1: 0, x2: width, y2: 0 }

  attr(gridPatternEl, bgRect)
  attr(bgRectEl, bgRect)
  attr(vertLineEl, vertLine)
  attr(horizLineEl, horizLine)
}
