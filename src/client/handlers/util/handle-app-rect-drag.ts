import { attr, strictSelect } from '../../lib/dom/util'
import { createLine, normalizeLine } from '../../lib/geometry/line'
import { Point, Rect } from '../../lib/geometry/types'
import { DragPredicate, DragTransformPoint } from '../../lib/handlers/types'
import { State } from '../../types'
import { handleAppDrag } from './handle-app-drag'

export const handleAppRectDrag = (
  name: string,
  state: State,
  predicate: DragPredicate,
  transformPoint: DragTransformPoint,
  createDragRect: () => SVGRectElement,
  onEndRect: (rect: Rect) => void
) => {
  const rectsEl = strictSelect<SVGGElement>('#rects')

  let dragRect: Rect | null = null
  let rectEl: SVGRectElement | null = null

  const onStart = () => {
    if( rectEl !== null ) rectEl.remove()
  }

  const onDrag = (start: Point, end: Point) => {
    if (rectEl === null) {
      rectEl = createDragRect()

      rectsEl.after(rectEl)
    }

    dragRect = getDragRect(start, end)
    attr(rectEl, dragRect)
  }

  const onEnd = () => {
    if (rectEl) {
      rectEl.remove()
    }

    if (dragRect && dragRect.width > 0 && dragRect.height > 0) {
      onEndRect(dragRect)
    }

    rectEl = null
    dragRect = null
  }

  return handleAppDrag(
    name, state, onDrag, { onStart, onEnd, transformPoint, predicate }
  )
}

const getDragRect = (start: Point, end: Point) => {
  const line = normalizeLine(createLine(start, end))

  const { x1: x, y1: y } = line
  const width = line.x2 - line.x1
  const height = line.y2 - line.y1

  const rect: Rect = { x, y, width, height }

  return rect
}
