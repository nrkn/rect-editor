import { lineToVector, createLine } from '../lib/geometry/line'
import { DragEventType } from '../lib/handlers/types'
import { State } from '../types'
import { handleAppDrag } from './helpers/handle-app-drag'

export const handlePanDrag = (state: State) => {
  /*
    You can only drag to pan with left mouse button if in pan mode

    You can drag to pan in any mode if wheel/middle button
  */
  let isWheelDrag = false

  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (type === 'start' && e.button === 1) {
      isWheelDrag = true

      return true
    }

    if (type === 'end') {
      isWheelDrag = false
    }

    if (isWheelDrag) return true

    if (state.mode() !== 'pan') return false
    if (type === 'start' && e.button !== 0) return false

    return true
  }

  return handleAppDrag(
    'pan-drag',
    state,
    (_start, end, prev) => {
      const transform = state.viewTransform()

      const v = lineToVector(createLine(prev, end))

      transform.x += v.x
      transform.y += v.y

      state.viewTransform(transform)
    },
    {
      predicate,
      transformPoint: p => p
    }
  )
}
