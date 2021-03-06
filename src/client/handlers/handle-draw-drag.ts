import { rect } from '../lib/dom/s'
import { Rect } from '../lib/geometry/types'
import { createNumericIndex, randomId } from '../lib/util'
import { State } from '../types'
import { handleAppRectDrag } from './helpers/handle-app-rect-drag'
import { createSnapTranslatePoint } from './util'
import { selectActions } from '../state/select-actions'
import { DragEventType } from '../lib/handlers/types'

export const handleDrawDrag = (state: State) => {
  const createIndex = createNumericIndex( 1 )  

  const { clearSelection } = selectActions( state )

  let dragging = false

  const predicate = ( e: MouseEvent, type: DragEventType ) => {
    if( state.mode() !== 'draw' ) return false
    if( type === 'start' && e.button !== 0 ) return false

    if( type === 'start' ){
      dragging = true
      clearSelection()
    }

    if( !dragging ) return false

    return true
  }

  const transformPoint = createSnapTranslatePoint( state )

  const createDrawDragRect = () => rect({ stroke: '#222', fill: 'none' })

  const onEndRect = ( dragRect: Rect ) => {
    const id = `rect-${ createIndex( 'rect' ) }-${ randomId() }`
    
    const appRect = Object.assign( 
      { id, 'data-style': state.currentStyleId() }, 
      dragRect 
    )
    
    state.rects.add([ appRect ])    
  }

  return handleAppRectDrag( 
    'draw-drag', state, predicate, transformPoint, createDrawDragRect, onEndRect 
  )
}
