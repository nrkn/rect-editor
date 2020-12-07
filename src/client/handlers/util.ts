import { handleSize } from '../consts'
import { getRectElRect, strictSelect } from '../lib/dom/util'
import { snapPointToGrid } from '../lib/geometry/point'
import { getEdgePositions } from '../lib/geometry/position'
import { rectContainsPoint, stringRectToRect } from '../lib/geometry/rect'
import { translateAndScalePoint } from '../lib/geometry/scale'
import { Point, Rect, StringRect } from '../lib/geometry/types'
import { Actions, AppRect, State } from '../types'

export const getPosition = (event: MouseEvent, bounds: DOMRect) => {
  const { clientX, clientY } = event
  const x = clientX - bounds.left
  const y = clientY - bounds.top
  const point: Point = { x, y }

  return point
}

export const createTranslatePoint = (state: State) =>
  (p: Point) => translateAndScalePoint(p, state.viewTransform())

export const createSnapTranslatePoint = (state: State) =>
  (point: Point) =>
    snapPointToGrid(
      translateAndScalePoint(point, state.viewTransform()),
      state.snap()
    )

export const svgRectToRect = (rectEl: SVGRectElement) => {
  const rect: Rect = rectEl.getBBox()

  return rect
}

export const getAllRects = () => {
  const rectsEl = strictSelect<SVGGElement>('#rects')
  const rectEls = [...rectsEl.querySelectorAll('rect')]

  return rectEls
}

export const getAllRectIds = () => getAllRects().map(el => el.id)

export const createSelectGetDragType = (
  actions: Actions, transformPoint: (p: Point) => Point
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const rectsEl = strictSelect<SVGGElement>('#rects')

  const getDragType = (e: MouseEvent) => {
    const bounds = viewportEl.getBoundingClientRect()
    const start = transformPoint(getPosition(e, bounds))

    // it's drag to move if the start point is in a selected rect
    if (actions.selection.any()) {
      const ids = actions.selection.get()

      const selectedRects = ids.map(
        id => getRectElRect(strictSelect(`#${id}`, rectsEl))
      )

      const isInSelectedRect = selectedRects.some(
        r => rectContainsPoint(r, start)
      )

      if (isInSelectedRect) return 'move'
    }

    return 'select'
  }

  return getDragType
}

export const getResizerPositions = (point: Point) => {
  const resizerEl = document.querySelector<SVGGElement>('#resizer')

  if (resizerEl === null) return

  const stringRect = resizerEl.dataset as StringRect
  const rect = stringRectToRect(stringRect)

  return getEdgePositions(rect, handleSize * 2, point)
}

export const getRectEls = (
  ids: string[], parent?: HTMLElement 
) => ids.map(
  id => strictSelect<SVGRectElement>(`#${id}`, parent)
)

export const getAppRects = ( 
  ids: string[], parent?: HTMLElement 
) => {
  const rectEls = getRectEls( ids, parent )

  const appRects = rectEls.map(el => {
    const { id } = el
    const rect = getRectElRect(el)

    const appRect: AppRect = Object.assign({ id }, rect)

    return appRect
  })

  return appRects
}