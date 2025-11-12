import {
  adjustAspectDelta,
  createSnapTranslatePoint, createTranslatePoint, getAppRects,
  getResizerPositions
} from './util'

import { attr, strictSelect } from '../lib/dom/util'
import { Positions } from '../lib/geometry/types'
import { State } from '../types'
import { deltaPoint } from '../lib/geometry/point'
import { getPosition } from '../lib/handlers/util'
import { selectActions } from '../state/select-actions'
import { DragEventType, OnHandleDrag } from '../lib/handlers/types'
import { getBoundingRect, scaleRectFrom } from '../lib/geometry/rect'
import { handleAppDrag } from './helpers/handle-app-drag'

export const handleSelectResizeDrag = (state: State) => {
  const { getSelected, setSelected } = selectActions(state)

  const viewportEl = strictSelect<HTMLElement>('#viewport')
  let positions: Positions | null = null

  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (state.mode() !== 'select') return false

    if (type === 'start') {
      if (e.button !== 0) return false

      const transformPositionsPoint = createTranslatePoint(state)

      const bounds = viewportEl.getBoundingClientRect()
      const positionsPoint = transformPositionsPoint(getPosition(e, bounds))

      positions = getResizerPositions(positionsPoint) || null

      //console.log('resize-drag positions', positions)

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

    let dX = delta.x
    let dY = delta.y

    if (dX === 0 && dY === 0) {
      return
    }

    const ids = getSelected()
    const appRects = getAppRects(ids)
    const bounds = getBoundingRect(appRects)

    if (bounds === undefined) {
      return
    }

    const isAspectRatio = state.keys.Shift
    const hasBounds = bounds.width > 0 && bounds.height > 0

    if (isAspectRatio && hasBounds) {
      const aspect = bounds.width / bounds.height
      
      const { x: ax, y: ay } = adjustAspectDelta(
        dX, dY, positions, aspect
      )

      dX = ax
      dY = ay
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
    'select-resize-drag',
    state,
    onDrag,
    { onEnd, transformPoint, predicate }
  )
}
