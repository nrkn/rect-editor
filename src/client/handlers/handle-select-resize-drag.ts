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

  // freeze aspect ratio at start of gesture so it doesn't drift
  // if lock disengages or flips occur
  let initialAspect: number | null = null

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

        // intial aspect ratio of the selection
        const ids = getSelected()
        const appRects = getAppRects(ids)
        const b = getBoundingRect(appRects)

        if (b && b.width > 0 && b.height > 0) {
          initialAspect = b.width / b.height
        } else {
          initialAspect = null
        }
      }
    }

    return positions !== null
  }

  const transformPoint = createSnapTranslatePoint(state)

  const onDrag: OnHandleDrag = (_start, end, prev) => {
    if (positions === null)
      throw Error('Expected positions')

    const delta = deltaPoint(end, prev)

    // Raw pointer delta (snapped in transformPoint already)
    const rawDX = delta.x
    const rawDY = delta.y

    let dX = rawDX
    let dY = rawDY

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

    // use the aspect ratio from gesture start when available
    const aspect = initialAspect ?? (
      hasBounds ? (bounds.width / bounds.height) : undefined
    )

    // detect crossing (flip) and swap handle positions so subsequent deltas
    // behave as if the user grabbed the opposite handle after crossing
    const [xPos, yPos] = positions
    const left = bounds.x
    const right = bounds.x + bounds.width
    const top = bounds.y
    const bottom = bounds.y + bounds.height

    // new sides based on current origin positions and RAW (unconstrained) delta
    let newLeft = left
    let newRight = right
    let newTop = top
    let newBottom = bottom

    if (xPos === 'left') newLeft += rawDX
    if (xPos === 'right') newRight += rawDX
    if (yPos === 'top') newTop += rawDY
    if (yPos === 'bottom') newBottom += rawDY

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

    // after establishing final positions (with any flips), apply aspect 
    // constraint using RAW deltas so prediction doesn't trigger flips
    if (isAspectRatio && hasBounds && aspect !== undefined) {
      const { x: ax2, y: ay2 } = adjustAspectDelta(
        rawDX, rawDY, positions, aspect
      )

      dX = ax2
      dY = ay2
    } else {
      dX = rawDX
      dY = rawDY
    }

    appRects.forEach(appRect => {
      const el = strictSelect(`#${appRect.id}`)

      if (positions === null) return

      const scaledRect = scaleRectFrom(
        bounds, appRect, { x: dX, y: dY }, positions, isAspectRatio
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
