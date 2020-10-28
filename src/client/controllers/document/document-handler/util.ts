import { getRectElRect } from '../../../lib/dom/geometry'
import { normalizeLine, getStart, lineToVector } from '../../../lib/geometry/line'
import { snapPointToGrid } from '../../../lib/geometry/point'
import { rectContainsPoint, rectIntersection } from '../../../lib/geometry/rect'
import { translateAndScalePoint } from '../../../lib/geometry/transform'
import { Line, Point, Rect } from '../../../lib/geometry/types'
import { GetStateRecord } from '../../../lib/state/types'
import { AppModel } from '../../app/types'
import { rectModelKeys } from '../../rect/types'
import { DocumentActions } from '../types'

export const lineToRect = (line: Line) => {
  const normal = normalizeLine(line)
  const { x, y } = getStart(normal)
  const { x: width, y: height } = lineToVector(normal)

  const rect = { x, y, width, height }

  return rect
}

export const getAllRectEls = (viewportEl: HTMLElement) => {
  const rectEls = viewportEl.querySelectorAll<SVGRectElement>('.rectEl')

  return [...rectEls]
}

export const getAllRectIds = (viewportEl: HTMLElement) =>
  getAllRectEls(viewportEl).map(el => el.id)

export const createSnappedTransformPoint = (getState: GetStateRecord<AppModel>) =>
  (point: Point) =>
    snapPointToGrid(
      translateAndScalePoint(point, getState.viewportTransform()),
      getState.snapSize()
    )

export const createTransformPoint = (getState: GetStateRecord<AppModel>) =>
  (point: Point) =>
    snapPointToGrid(
      translateAndScalePoint(point, getState.viewportTransform()),
      { width: 1, height: 1 }
    )

// if multiple ids, the last one is topmost
export const rectIdsAt = (viewportEl: HTMLElement, point: Point) => {
  const ids: string[] = []
  const rectEls = getAllRectEls(viewportEl)

  rectEls.forEach(el => {
    const rect = getRectElRect(el)

    if (rectContainsPoint(rect, point)) {
      ids.push(el.id)
    }
  })

  return ids
}

export const rectIdsIntersect = (viewportEl: HTMLElement, rect: Rect) => {
  const rectEls = getAllRectEls(viewportEl)
  const ids: string[] = []

  rectEls.forEach(el => {
    const elRect = getRectElRect(el)

    if (rectIntersection(rect, elRect)) {
      ids.push(el.id)
    }
  })

  return ids
}

export const hasRectAt = (viewportEl: HTMLElement, point: Point) => {
  const rectEls = getAllRectEls(viewportEl)

  return rectEls.some( el => {
    const rect = getRectElRect(el)

    return rectContainsPoint( rect, point )
  })
}  

export const hasSelectedRectAt = (viewportEl: HTMLElement, point: Point) => {
  const rectEls = getAllRectEls(viewportEl)

  const hasRect = rectEls.some( el => {
    const rect = getRectElRect(el)

    return (
      rectContainsPoint( rect, point ) && 
      el.classList.contains( 'selected' )
    )
  })

  return hasRect
}