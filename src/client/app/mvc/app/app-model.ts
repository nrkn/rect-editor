import { createEmitter } from '../../../lib/events'
import { AppMode } from '../../types'

export const createAppModel = () => {
  let appMode: AppMode = 'pan'  

  const mode = ( newMode: AppMode ) => {
    appMode = newMode

    events.mode.emit( appMode )
  }

  const zoomToFit = () => {

  }

  const events = {
    mode: createEmitter<AppMode>()
  }

  return { mode, events, zoomToFit }
}
