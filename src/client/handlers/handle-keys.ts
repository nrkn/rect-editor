import { Actions, State } from '../types'
import { getAllRectIds } from './util'

export const handleKeys = ( state: State, actions: Actions ) => {
  document.addEventListener( 'keydown', e => {
    state.keys[e.key] = true

    const lower = e.key.toLowerCase()

    if (state.keys.Control && lower === 'z') {
      e.preventDefault()

      state.keys.Shift ? actions.rects.redo() : actions.rects.undo()

      return
    }

    if (state.keys.Control && lower === 'a') {
      e.preventDefault()

      actions.selection.clear()

      if (!state.keys.Shift) {
        actions.selection.add(getAllRectIds())
      }
    }

    if (e.key === 'Delete') {
      e.preventDefault()

      const selectedIds = actions.selection.get()

      if (selectedIds.length === 0) return

      actions.rects.remove(selectedIds)
      actions.selection.clear()
    }    
  })
  
  document.addEventListener( 'keyup', e => {
    state.keys[e.key] = false
  })
}
