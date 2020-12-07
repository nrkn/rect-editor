import { rect } from '../lib/dom/s'
import { Rect } from '../lib/geometry/types'
import { randomId } from '../lib/util'
import { Actions, State } from '../types'
import { handleRectDrag } from './handle-rect-drag'
import { DragEventType } from './types'
import { createSnapTranslatePoint } from './util'

export const handleDrawDrag = (state: State, actions: Actions) => {
  let dragging = false

  const predicate = ( e: MouseEvent, type: DragEventType ) => {
    if( state.mode() !== 'draw' ) return false
    if( type === 'start' && e.button !== 0 ) return false

    if( type === 'start' ){
      dragging = true
    }

    if( !dragging ) return false

    actions.selection.clear()

    return true
  }

  const transformPoint = createSnapTranslatePoint( state )

  const createDrawDragRect = () => rect({ stroke: '#222', fill: 'none' })

  const onEndRect = ( dragRect: Rect ) => {
    const id = randomId()

    const appRect = Object.assign( { id }, dragRect )
    
    actions.rects.add([ appRect ])    
  }

  handleRectDrag( 
    state, predicate, transformPoint, createDrawDragRect, onEndRect 
  )
}
