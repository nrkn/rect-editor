import { getRectElRect } from '../../../lib/dom/geometry'
import { rect } from '../../../lib/dom/s'
import { strictSelect, attr } from '../../../lib/dom/util'
import { getStart } from '../../../lib/geometry/line'
import { Line } from '../../../lib/geometry/types'
import { keys } from '../../../lib/keys'
import { State } from '../../../lib/state/types'
import { AppModel } from '../../app/types'
import { DocumentActions, DocumentElements } from '../types'
import { DragHandler } from './types'

import { 
  createTransformPoint, lineToRect, rectIdsIntersect, hasSelectedRectAt 
} from './util'

export const createSelectDragHandler = (
  elements: DocumentElements,
  documentActions: DocumentActions,
  appState: State<AppModel>
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const { groupEl } = elements
  const { get: getState } = appState

  let selectRectEl: SVGRectElement | null = null

  /*
    You can drag to select if there is no selected rect at the start point of 
    the drag
  */
  const predicate = ( line: Line ) => {
    if( appState.get.appMode() !== 'select' ) return false

    if( hasSelectedRectAt( viewportEl, getStart( line ) ) ) return false

    return true
  }

  const transformPoint = createTransformPoint(getState)

  const start = ( line: Line ) => {
    const lineRect = lineToRect(line)

    selectRectEl = rect(
      { class: 'selectRectEl' }, lineRect
    )

    groupEl.append( selectRectEl )
  }

  const dragging = ( line: Line ) => {
    if( selectRectEl === null ) throw Error( 'Dragging: expected selectRectEl' )

    const lineRect = lineToRect(line)

    attr( selectRectEl, lineRect )
  }

  const end = () => {
    if( selectRectEl === null ) throw Error( 'Drag end: expected selectRectEl' )

    // select all in rect
    const selectRect = getRectElRect( selectRectEl )
    const ids  = rectIdsIntersect( viewportEl, selectRect )

    if (keys.Shift) {
      documentActions.selection.toggle(ids)
    } else {
      documentActions.selection.clear()
      documentActions.selection.add(ids)
    }    

    selectRectEl.remove()
    selectRectEl = null
  }

  const selectDragHandler: DragHandler = {
    predicate, transformPoint, start, dragging, end
  }

  return selectDragHandler
}