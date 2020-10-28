import { pipeStatePartial } from '../../lib/state'
import { createDocumentState } from './document-state'
import { createDocumentView } from './document-view'

export const createDocumentController = () => {
  const { documentState, rectCollection } = createDocumentState()
  const documentView = createDocumentView()

  pipeStatePartial( documentState.on, documentView.render )

  rectCollection.on.add( documentView.render.createRects )
  rectCollection.on.update( documentView.render.updateRects )
  rectCollection.on.remove( documentView.render.removeRects )
  rectCollection.on.setOrder( documentView.render.orderRects )

  return { documentState, rectCollection, documentView }
}
