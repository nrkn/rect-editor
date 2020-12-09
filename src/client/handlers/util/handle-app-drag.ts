import { updateDeltaEl } from '../../els/info-delta'
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

  const { onEnd } = opts

  const onDragWithDelta: OnHandleDrag = ( start, end, prev ) => {
    onDrag( start, end, prev )

    updateDeltaEl(deltaPoint(end,start), name)
  }

  const onDragEndWithDelta: OnHandleDrag = ( start, end, prev ) => {
    if( onEnd !== undefined ){
      onEnd( start, end, prev )
    }

    updateDeltaEl()
  }

  const defaultOptions: Partial<DragOptions> = {
    transformPoint: createTranslatePoint( state )
  }

  const options = Object.assign( 
    {}, 
    defaultOptions, 
    opts,
    {
      onEnd: onDragEndWithDelta
    }
  )

  handleDrag( viewportEl, onDragWithDelta, options )
}
