import { pipeState } from '../../lib/state'
import { createAppState } from './app-state'
import { createAppView } from './app-view'
import { AppViewOptions } from './types'

export const createAppController = ( options: AppViewOptions ) => {
  const appState = createAppState()
  const appView = createAppView( options )

  pipeState( appState.on, appView.render )

  return { appState, appView }
}