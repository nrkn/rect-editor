import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'
import { getAllRectIds } from './util'

export const handleSelectKeys = ( state: State ) => { 
  const { 
    get: getSelection, clear: clearSelection, add: addToSelection
  } = state.selector.actions
  
  const down = ( e: KeyboardEvent ) => {
    const lower = e.key.toLowerCase()

    if (state.keys.Control && lower === 'a') {
      e.preventDefault()

      clearSelection()

      if (!state.keys.Shift) {
        addToSelection( getAllRectIds() )
      }

      state.mode( 'select' )
    }

    if (e.key === 'Delete' && state.mode() === 'select' ) {
      e.preventDefault()

      const selectedIds = getSelection()

      if (selectedIds.length === 0) return

      state.rects.remove(selectedIds)
      
      clearSelection()
    }   
  }

  const enabler = () => {
    document.addEventListener( 'keydown', down )
  }

  const disabler = () => {
    document.removeEventListener( 'keydown', down )
  }

  return createHandler( 'rect-collection-keys', enabler, disabler )
}
