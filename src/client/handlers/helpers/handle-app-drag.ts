import { updateDeltaEl } from '../../els/infos/info-delta'
import { strictSelect } from '../../lib/dom/util'
import { deltaPoint } from '../../lib/geometry/point'
import { State } from '../../types'
import { createTranslatePoint } from '../util'
import { DragOptions, OnHandleDrag } from '../../lib/handlers/types'
import { handleDrag } from '../../lib/handlers/handle-drag'

export const handleAppDrag = (
  name: string,
  state: State, 
  onDrag: OnHandleDrag,
  opts: Partial<DragOptions>
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const { onStart, onEnd } = opts

  const onDragWithDelta: OnHandleDrag = ( start, end, prev ) => {
    onDrag( start, end, prev )

    updateDeltaEl(deltaPoint(end,start), name)
    
    //console.log( name, 'dragging' )
  }

  const onDragStart: OnHandleDrag = ( start, end, prev ) => {
    if( onStart !== undefined ){
      onStart( start, end, prev )
    }

    //console.log( name, 'drag start', start )
  }

  const onDragEndWithDelta: OnHandleDrag = ( start, end, prev ) => {
    if( onEnd !== undefined ){
      onEnd( start, end, prev )
    }

    updateDeltaEl()
    //console.log( name, 'drag end', start, end )
  }

  const defaultOptions: Partial<DragOptions> = {
    transformPoint: createTranslatePoint( state )
  }

  const options = Object.assign( 
    {}, 
    defaultOptions, 
    opts,
    {
      onStart: onDragStart,
      onEnd: onDragEndWithDelta
    }
  )

  return handleDrag( name, viewportEl, onDragWithDelta, options )
}
