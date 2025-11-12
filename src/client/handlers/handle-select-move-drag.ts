import { attr, getRectElRect, strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { getPosition } from '../lib/handlers/util'
import { handleAppDrag } from './helpers/handle-app-drag'
import { DragEventType, OnHandleDrag } from '../lib/handlers/types'

import {
  createSelectGetDragType, createSnapTranslatePoint, createTranslatePoint, 
  getAppRects, getResizerPositions
} from './util'

export const handleSelectMoveDrag = (state: State) => {
  const { get: getSelection, set: setSelection } = state.selector.actions

  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (state.mode() !== 'select') return false

    if (type === 'start') {
      if (e.button !== 0) return false

      if (getSelectDragType(e) !== 'move') return false

      const transformPositionsPoint = createTranslatePoint( state)

      const bounds = viewportEl.getBoundingClientRect()
      const positionsPoint = transformPositionsPoint(getPosition(e, bounds))
      const positions = getResizerPositions(positionsPoint)

      //console.log( 'move-drag positions', positions )

      if (positions === undefined) return true

      const [xPosition, yPosition] = positions

      if (xPosition === 'xCenter' && yPosition === 'yCenter') return true

      return false
    }

    return true
  }

  const transformPoint = createSnapTranslatePoint(state)
  const getSelectDragType = createSelectGetDragType(state, transformPoint)

  const onDrag: OnHandleDrag = (_start, end, prev) => {
    const dX = end.x - prev.x
    const dY = end.y - prev.y

    if (dX === 0 && dY === 0) return

    const ids = getSelection()

    const rectEls = ids.map(
      id => strictSelect<SVGRectElement>(`#${id}`)
    )

    rectEls.forEach(el => {
      let { x, y } = getRectElRect(el)

      x += dX
      y += dY

      attr(el, { x, y })
    })

    setSelection(ids)
  }

  const onEnd: OnHandleDrag = () => {
    const ids = getSelection()
    const appRects = getAppRects(ids)

    state.rects.update(appRects)

    setSelection(ids)
  }

  return handleAppDrag(
    'select-move-drag',
    state,
    onDrag,
    { transformPoint, predicate, onEnd }
  )
}
