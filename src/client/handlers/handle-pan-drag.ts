import { updateDeltaEl } from '../els/info-delta'
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

      const v = lineToVector(createLine(start, end))

      transform.x += v.x
      transform.y += v.y


      state.viewTransform(transform)
    },
    { predicate }
  )
}
