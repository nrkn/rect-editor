import { lineToVector, createLine } from '../lib/geometry/line'
import { State } from '../types'
import { handleDrag } from './handle-drag'
import { DragEventType } from './types'

export const handlePanDrag = (state: State) => {
  /*
    You can only drag to pan with left mouse button if in pan mode

    You can drag to pan in any mode if wheel/middle button
  */
 let isWheelDrag = false

 const predicate = ( e: MouseEvent, type: DragEventType ) => {
    if( type === 'start' && e.button === 1 ){
      isWheelDrag = true

      return true
    }

    if( type === 'end' ){
      isWheelDrag = false
    }

    if( isWheelDrag ) return true

    if( state.mode() !== 'pan' ) return false
    if( type === 'start' && e.button !== 0 ) return false

    return true
  }

  return handleDrag(
    state,
    (start, end) => {
      const transform = state.viewTransform()

      const { x: dX, y: dY } = lineToVector(createLine(start, end))

      transform.x += dX
      transform.y += dY

      state.viewTransform(transform)
    },
    { predicate }
  )
}
