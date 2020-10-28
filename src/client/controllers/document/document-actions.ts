import { Collection } from '../../lib/collection/types'
import { createSelector } from '../../lib/select'
import { EventedState } from '../../lib/state/types'
import { RectModel } from '../rect/types'
import { DocumentActions, DocumentViewModel } from './types'

export const createDocumentActions = (
  documentState: EventedState<DocumentViewModel>,
  rectCollection: Collection<RectModel>
) => {
  const selector = createSelector()

  const { undo: u, redo: r, toStart, toEnd, forward, back } = rectCollection

  const undo = () => {
    selector.actions.clear()
    u()
  }

  const redo = () => {
    selector.actions.clear()
    r()
  }

  const { actions: selection } = selector

  const documentActions: DocumentActions = {
    undo, redo, toStart, toEnd, forward, back, selection
  }

  selector.on( documentState.set.selection )

  return documentActions
}
