import { attr, strictSelect } from '../lib/dom/util'
import { createLine, normalizeLine } from '../lib/geometry/line'
import { Point, Rect } from '../lib/geometry/types'
import { State } from '../types'
import { handleDrag } from './handle-drag'
import { DragPredicate, DragTransformPoint } from './types'

export const handleRectDrag = (
  state: State,
  predicate: DragPredicate, 
  transformPoint: DragTransformPoint,
  createDragRect: () => SVGRectElement,
  onEndRect: ( rect: Rect ) => void
) => {
  const rectsEl = strictSelect<SVGGElement>('#rects')

  let dragRect: Rect | null = null
  let rectEl: SVGRectElement | null = null

  const onStart = () => {
    rectEl = createDragRect()
    dragRect = { x: 0, y: 0, width: 0, height: 0 }

    rectsEl.append(rectEl)
  }

  const onDrag = (start: Point, end: Point) => {
    if (rectEl === null) return

    dragRect = getDragRect(start, end)

    attr(rectEl, dragRect)
  }

  const onEnd = () => {
    if (rectEl === null) return
    if (dragRect === null) return

    rectEl.remove()

    if (dragRect.width >= 1 && dragRect.height >= 1 ){            
      onEndRect( dragRect )
    } 

    rectEl = null
    dragRect = null
  }

  handleDrag( state, onDrag, { onStart, onEnd, transformPoint, predicate } )
}

const getDragRect = (start: Point, end: Point) => {
  const line = normalizeLine(createLine(start, end))

  const { x1: x, y1: y } = line
  const width = line.x2 - line.x1
  const height = line.y2 - line.y1

  const rect: Rect = { x, y, width, height }

  return rect
}
