import {
  createSnapTranslatePoint, getAppRects, getResizerPositions
} from './util'

import { attr, strictSelect } from '../lib/dom/util'
import { Positions } from '../lib/geometry/types'
import { State } from '../types'
import { deltaPoint } from '../lib/geometry/point'
import { getPosition } from '../lib/handlers/util'
import { selectActions } from '../state/select-actions'
import { DragEventType, OnHandleDrag } from '../lib/handlers/types'
import { getBoundingRect, scaleRectFrom } from '../lib/geometry/rect'
import { handleAppDrag } from './util/handle-app-drag'

export const handleResizeDrag = (state: State) => {
  const { getSelected, setSelected } = selectActions(state)

  const viewportEl = strictSelect<HTMLElement>('#viewport')
  let positions: Positions | null = null

  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (state.mode() !== 'select') return false

    if (type === 'start') {
      if (e.button !== 0) return false

      const bounds = viewportEl.getBoundingClientRect()
      const point = transformPoint(getPosition(e, bounds))

      positions = getResizerPositions(point) || null

      if (positions !== null) {
        const [xPosition, yPosition] = positions

        if (xPosition === 'xCenter' && yPosition === 'yCenter') return false
      }
    }

    return positions !== null
  }

  const transformPoint = createSnapTranslatePoint(state)

  const onDrag: OnHandleDrag = (_start, end, prev) => {
    if (positions === null)
      throw Error('Expected positions')

    const delta = deltaPoint(end, prev)

    const dX = delta.x
    const dY = delta.y

    if (dX === 0 && dY === 0) {
      return
    }

    const ids = getSelected()
    const appRects = getAppRects(ids)
    const bounds = getBoundingRect(appRects)

    if (bounds === undefined) {
      return
    }

    appRects.forEach(appRect => {
      const el = strictSelect(`#${appRect.id}`)

      if (positions === null) return

      const scaledRect = scaleRectFrom(
        bounds, appRect, { x: dX, y: dY }, positions
      )

      if (scaledRect === undefined) return

      attr(el, scaledRect)
    })

    setSelected(ids)
  }

  const onEnd: OnHandleDrag = () => {
    positions = null

    const ids = getSelected()
    const appRects = getAppRects(ids)

    state.rects.update(appRects)
    setSelected(ids)
  }

  return handleAppDrag(
    'resize',
    state,
    onDrag,
    { onEnd, transformPoint, predicate }
  )
}
