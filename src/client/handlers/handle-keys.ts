import { State } from '../types'
import { getAllRectIds } from './util'

export const handleKeys = ( state: State ) => {
  const { 
    get: getSelection, clear: clearSelection, add: addToSelection
  } = state.selector.actions
  
  document.addEventListener( 'keydown', e => {
    state.keys[e.key] = true

    const lower = e.key.toLowerCase()

    if (state.keys.Control && lower === 'z') {
      e.preventDefault()

      state.keys.Shift ? state.rects.redo() : state.rects.undo()

      return
    }

    if (state.keys.Control && lower === 'a') {
      e.preventDefault()

      clearSelection

      if (!state.keys.Shift) {
        addToSelection( getAllRectIds() )
      }
    }

    if (e.key === 'Delete') {
      e.preventDefault()

      const selectedIds = getSelection()

      if (selectedIds.length === 0) return

      state.rects.remove(selectedIds)
      
      clearSelection()
    }    
  })
  
  document.addEventListener( 'keyup', e => {
    state.keys[e.key] = false
  })
}
