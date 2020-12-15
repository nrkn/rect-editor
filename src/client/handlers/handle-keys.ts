import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'
import { getAllRectIds } from './util'

export const handleKeys = ( state: State ) => {
  const { 
    get: getSelection, clear: clearSelection, add: addToSelection
  } = state.selector.actions
  
  const down = ( e: KeyboardEvent ) => {
    state.keys[e.key] = true
  }

  const up = ( e: KeyboardEvent ) => {
    state.keys[e.key] = false
  }

  const enabler = () => {
    document.addEventListener( 'keydown', down )
    document.addEventListener( 'keyup', up )
  }

  const disabler = () => {
    document.removeEventListener( 'keydown', down )
    document.removeEventListener( 'keyup', up )
  }

  return createHandler( 'keys', enabler, disabler )
}
