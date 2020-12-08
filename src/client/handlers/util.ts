import { handleSize } from '../consts'
import { getRectElRect, strictSelect } from '../lib/dom/util'
import { snapPointToGrid } from '../lib/geometry/point'
import { getEdgePositions } from '../lib/geometry/position'
import { rectContainsPoint, stringRectToRect } from '../lib/geometry/rect'
import { translateAndScalePoint } from '../lib/geometry/scale'
import { Point, Rect, StringRect } from '../lib/geometry/types'
import { AppRect, State } from '../types'

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
  const rectEls = [...rectsEl.querySelectorAll('rect')].filter( el => {
    if( el.id === '' ){
      console.warn( '<rect> in rects has no ID', el )
      
      return false
    }

    return true
  })

  return rectEls
}

export const getAllRectIds = () => getAllRects().map(el => el.id)

export const createSelectGetDragType = (
  state: State, transformPoint: (p: Point) => Point
) => {
  const { any: anySelected, get: getSelectedIds } = state.selector.actions

  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const rectsEl = strictSelect<SVGGElement>('#rects')

  const getDragType = (e: MouseEvent) => {
    const bounds = viewportEl.getBoundingClientRect()
    const start = transformPoint(getPosition(e, bounds))

    // it's drag to move if the start point is in a selected rect
    if (anySelected()) {
      const ids = getSelectedIds()

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
    const style = el.dataset.style || 'none'

    const { id } = el
    const rect = getRectElRect(el)

    const appRect: AppRect = Object.assign({ id, 'data-style': style }, rect)

    return appRect
  })

  return appRects
}

