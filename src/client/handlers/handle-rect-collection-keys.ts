import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'

export const handleRectCollectionKeys = ( state: State ) => { 
  const down = ( e: KeyboardEvent ) => {
    const lower = e.key.toLowerCase()

    if (state.keys.Control && lower === 'z') {
      e.preventDefault()

      state.keys.Shift ? state.rects.redo() : state.rects.undo()

      return
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
