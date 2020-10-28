import { Collection } from '../../../lib/collection/types'
import { strictSelect } from '../../../lib/dom/util'
import { createDragEmitter } from '../../../lib/events/drag-emitter'
import { transformLine } from '../../../lib/geometry/line'
import { Line } from '../../../lib/geometry/types'
import { SetStateRecord, State } from '../../../lib/state/types'
import { AppModel } from '../../app/types'
import { RectModel } from '../../rect/types'
import { DocumentActions, DocumentElements, DocumentViewModel } from '../types'
import { createDrawDragHandler } from './draw-drag-handler'
import { startKeyEvents } from './key-events'
import { createMoveDragHandler } from './move-drag-handler'
import { createSelectDragHandler } from './select-drag-handler'
import { startSelectTapHandler } from './select-tap-handler'
import { DragHandler } from './types'

export const startDocumentHandler = (
  render: SetStateRecord<DocumentViewModel>,
  elements: DocumentElements,
  rectCollection: Collection<RectModel>,
  documentActions: DocumentActions,
  appState: State<AppModel>
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const drawDragHandler = createDrawDragHandler(
    render, rectCollection, documentActions.selection, appState.get
  )

  const selectDragHandler = createSelectDragHandler(
    elements, documentActions, appState
  )

  const moveDragHandler = createMoveDragHandler(
    elements, rectCollection, documentActions, appState.get
  )

  const dragHandlerMap: Record<string, DragHandler> = {
    drawDragHandler, selectDragHandler, moveDragHandler
  }

  startDragHandlers( viewportEl, dragHandlerMap )
  startKeyEvents(rectCollection, documentActions)
  startSelectTapHandler(documentActions, appState)
}

const startDragHandlers = ( 
  viewportEl: HTMLElement,
  dragHandlerMap: Record<string, DragHandler> 
) => {
  const dragEvents = createDragEmitter(viewportEl)

  const handlerNames = Object.keys(dragHandlerMap)

  let currentHandler: DragHandler | null = null

  const setCurrentHandler = (line: Line) => {    
    /*
      we don't just use find because we want to verify our predicates don't 
      overlap
    */
    const matchingNames = handlerNames.filter(
      n => {
        const handler = dragHandlerMap[n]

        return handler.predicate(
          transformLine(line, handler.transformPoint)
        )
      }
    )

    if (matchingNames.length === 0)
      return

    if (matchingNames.length > 1)
      throw Error('Expected to find no more than one drag handler')

    const [name] = matchingNames

    currentHandler = dragHandlerMap[name]
  }

  const pipe = (key: 'start' | 'dragging' | 'end') => {
    dragEvents[key].on((line: Line) => {
      if (key === 'start') {
        setCurrentHandler( line )
      }

      if (currentHandler === null) return

      line = transformLine(line, currentHandler.transformPoint)

      currentHandler[key](line)

      if (key === 'end') {
        currentHandler = null
      }
    })
  }

  pipe('start')
  pipe('dragging')
  pipe('end')
}
