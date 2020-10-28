import { Collection } from '../../../lib/collection/types'
import { strictSelect } from '../../../lib/dom/util'
import { keys } from '../../../lib/keys'
import { RectModel } from '../../rect/types'
import { DocumentActions } from '../types'
import { getAllRectIds } from './util'

export const startKeyEvents = (
  rectCollection: Collection<RectModel>,
  documentActions: DocumentActions
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  document.addEventListener('keydown', e => {
    if (keys.Control && e.key.toLowerCase() === 'z') {
      e.preventDefault()

      keys.Shift ? documentActions.redo() : documentActions.undo()

      return
    }

    if (keys.Control && e.key.toLowerCase() === 'a') {
      e.preventDefault()

      documentActions.selection.clear()

      if (!keys.Shift) {
        documentActions.selection.add(getAllRectIds(viewportEl))
      }
    }

    if (e.key === 'Delete') {
      const selectedIds = documentActions.selection.get()

      if (selectedIds.length === 0) return

      rectCollection.remove(selectedIds)
      documentActions.selection.clear()
    }
  })
}