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

    // detect crossing (flip) and swap handle positions so subsequent deltas
    // behave as if the user grabbed the opposite handle after crossing
    const [xPos, yPos] = positions
    const left = bounds.x
    const right = bounds.x + bounds.width
    const top = bounds.y
    const bottom = bounds.y + bounds.height

    // new sides based on current origin positions and delta
    let newLeft = left
    let newRight = right
    let newTop = top
    let newBottom = bottom

    if (xPos === 'left') newLeft += dX
    if (xPos === 'right') newRight += dX
    if (yPos === 'top') newTop += dY
    if (yPos === 'bottom') newBottom += dY

    const predictedWidth = newRight - newLeft
    const predictedHeight = newBottom - newTop

    let flippedX = false
    let flippedY = false

    if (predictedWidth < 0) {
      flippedX = true
      positions[0] = xPos === 'left' ? 'right' : 'left'
    }

    if (predictedHeight < 0) {
      flippedY = true
      positions[1] = yPos === 'top' ? 'bottom' : 'top'
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
