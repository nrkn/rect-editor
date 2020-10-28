import { Collection } from '../../../lib/collection/types'
import { getRectElRect } from '../../../lib/dom/geometry'
import { attr, strictGetData, strictSelect } from '../../../lib/dom/util'
import { getStart, lineToVector } from '../../../lib/geometry/line'
import { snapPointToGrid } from '../../../lib/geometry/point'
import { Line } from '../../../lib/geometry/types'
import { GetStateRecord } from '../../../lib/state/types'
import { AppModel } from '../../app/types'
import { RectModel } from '../../rect/types'
import { DocumentActions, DocumentElements } from '../types'
import { DragHandler } from './types'
import { createSnappedTransformPoint, hasRectAt, hasSelectedRectAt } from './util'

export const createMoveDragHandler = (
  elements: DocumentElements,
  rectCollection: Collection<RectModel>,
  documentActions: DocumentActions,
  getState: GetStateRecord<AppModel>
) => {
  const { groupEl } = elements
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  // you can move if in select mode and the start of the drag was a selection
  const predicate = ( line: Line ) => 
    getState.appMode() === 'select' && 
    hasSelectedRectAt( viewportEl, getStart( line ) )

  const transformPoint = createSnappedTransformPoint(getState)

  const start = () => {
    const selectedRectEls = groupEl.querySelectorAll<SVGRectElement>( 
      '.selected' 
    )

    selectedRectEls.forEach( el => {
      const { x, y } = getRectElRect( el )

      el.dataset.x = String( x )
      el.dataset.y = String( y )
    })
  }

  const dragging = (line: Line) => {
    const selectedRectEls = groupEl.querySelectorAll<SVGRectElement>( 
      '.selected' 
    )

    const { x: dx, y: dy } = snapPointToGrid( 
      lineToVector(line), getState.snapSize() 
    )

    selectedRectEls.forEach( el => {
      const ox = Number( strictGetData( el, 'x' ) )
      const oy = Number( strictGetData( el, 'y' ) )

      const x = dx + ox
      const y = dy + oy

      attr( el, { x, y } )
    })

    documentActions.selection.clear()
    documentActions.selection.add( 
      [ ...selectedRectEls ].map( el => el.id ) 
    )
  }

  const end = () => {
    const selectedRectEls = groupEl.querySelectorAll<SVGRectElement>( 
      '.selected' 
    )

    const updates: RectModel[] = []

    selectedRectEls.forEach( el => {
      const id = el.id
      const rect = getRectElRect( el )

      updates.push( { id, rect } )
    })

    rectCollection.update( updates )
    documentActions.selection.clear()
    documentActions.selection.add( updates.map( u => u.id ) )
  }

  const moveDragHandler: DragHandler = {
    predicate, transformPoint, start, dragging, end
  }

  return moveDragHandler
} 