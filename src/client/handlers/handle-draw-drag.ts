import { getCurrentStyle } from '../els/util'
import { rect } from '../lib/dom/s'
import { Rect } from '../lib/geometry/types'
import { randomId } from '../lib/util'
import { State } from '../types'
import { handleRectDrag } from './handle-rect-drag'
import { DragEventType } from './types'
import { createSnapTranslatePoint } from './util'
import { selectActions } from '../state/select-actions'

export const handleDrawDrag = (state: State) => {
  const { clearSelection } = selectActions( state )

  let dragging = false

  const predicate = ( e: MouseEvent, type: DragEventType ) => {
    if( state.mode() !== 'draw' ) return false
    if( type === 'start' && e.button !== 0 ) return false

    if( type === 'start' ){
      dragging = true
    }

    if( !dragging ) return false

    clearSelection()

    return true
  }

  const transformPoint = createSnapTranslatePoint( state )

  const createDrawDragRect = () => rect({ stroke: '#222', fill: 'none' })

  const onEndRect = ( dragRect: Rect ) => {
    const id = randomId()
    
    const appRect = Object.assign( 
      { id, 'data-style': getCurrentStyle() }, 
      dragRect 
    )
    
    state.rects.add([ appRect ])    
  }

  handleRectDrag( 
    state, predicate, transformPoint, createDrawDragRect, onEndRect 
  )
}
