import { AppOptions } from '../../types'
import { createAppView } from './app-view'
import { createDocumentView } from '../document/document-view'

export const createAppController = ( options: AppOptions ) => {
  const documentView = createDocumentView( options )
  const appView = createAppView( options, documentView )

  appView.events.viewSize.on( documentView.setViewSize )
  appView.events.transform.on( documentView.setTransform )
  
  const run = () => {
    appView.render()
  }

  return { run }
}
