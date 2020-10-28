import { createEventedState, createEvents, createState } from '../../lib/state'
import { AppModel, appModelKeys } from './types'

export const createAppState = () => {  
  const state = createEventedState( 
    createState<AppModel>( appModelKeys ), 
    createEvents<AppModel>( appModelKeys ) 
  )
  
  return state
}
