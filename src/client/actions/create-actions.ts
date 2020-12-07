import { handleSize, minScale } from '../consts'
import { updateInfoSelection } from '../els/info-selection'
import { createResizer, updateResizer } from '../els/resizer'
import { createCollection } from '../lib/collection'
import { getRectElRect, strictSelect } from '../lib/dom/util'
import { getBoundingRect } from '../lib/geometry/rect'
import { zoomAt } from '../lib/geometry/scale'
import { zoomToFit } from '../lib/geometry/size'
import { ScaleTransform } from '../lib/geometry/types'
import { createSelector } from '../lib/select'
import { Actions, AppRect, State } from '../types'
import { rectHandlers } from './rect-handlers'

export const createActions = (state: State) => {
  const zoomToFit = createZoomToFit(state)
  const zoomAt = createZoomAt(state)
  const rects = createCollection<AppRect>()
  const selector = createSelector()
  const { actions: selection } = selector
  const selectHandler = handleSelect()

  selector.on( selectHandler )
  
  const actions: Actions = {
    zoomToFit, zoomAt, rects, selection
  }

  rectHandlers(rects,actions)

  return actions
}

const createZoomToFit = (state: State) => {
  const action = () => {
    const viewSize = state.viewSize()
    const documentSize = state.documentSize()
    const transform = zoomToFit(viewSize, documentSize)

    state.viewTransform(transform)
  }

  return action
}

const createZoomAt = (state: State) => {
  const action = (transform: ScaleTransform) => {    
    const viewTransform = state.viewTransform()

    state.viewTransform(zoomAt(viewTransform, transform, minScale))
  }

  return action
}

const handleSelect = () => {
  const bodyEl = strictSelect<SVGGElement>( '#body' )
  const rectsEl = strictSelect<SVGGElement>('#rects')

  const handler = (ids: string[]) => {
    const existing = document.querySelector<SVGGElement>('#resizer')

    if (ids.length === 0){
      existing?.remove()
      updateInfoSelection()

      return
    }

    const rectEls = ids.map( 
      id => strictSelect<SVGRectElement>( `#${ id }`, rectsEl ) 
    )

    const rectElRects = rectEls.map( getRectElRect )

    const bounds = getBoundingRect( rectElRects )

    updateInfoSelection( bounds )

    if( bounds === undefined ){
      existing?.remove()

      return
    }

    if (existing){
      updateResizer( bounds, handleSize, existing )
    } else {
      const resizerEl = createResizer( bounds, handleSize )

      bodyEl.append( resizerEl ) 
    }
  }

  return handler
}
