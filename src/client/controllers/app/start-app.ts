import { createDocumentActions } from '../document/document-actions'
import { createDocumentController } from '../document/document-controller'
import { startDocumentHandler } from '../document/document-handler/document-handler'
import { DocumentElements } from '../document/types'
import { startTools } from '../tools/start-tools'
import { createAppActions } from './app-actions'
import { createAppController } from './app-controller'
import { startAppHandler } from './app-handler'
import { AppOptions, AppViewOptions } from './types'

export const startApp = ( options: AppOptions ) => {
  const { 
    documentState, rectCollection, documentView 
  } = createDocumentController()
  
  const { appState, appView } = createAppController( 
    createAppViewOptions( options, documentView.elements ) 
  )

  const appActions = createAppActions( appState, documentState.get, options ) 
  const documentActions = createDocumentActions( documentState, rectCollection )

  /*
    order is important - startTools must be called first - if it is wrong, the 
    offsets when drawing will be incorrect, and the viewport will initially be 
    sized incorrectly - should figure out exactly why and see if we can enforce 
    the order in code 
  */
  startTools( appState, appActions, documentActions )
  startDocumentHandler( 
    documentView.render, documentView.elements, rectCollection, documentActions, 
    appState 
  )
  startAppHandler( appView.elements, appState, appActions )

  appState.set.appMode( 'pan' )
  appState.set.snapSize( options.snap )
  documentState.set.gridSize( options.gridSize )
  documentState.set.cellSize( options.cellSize )

  appActions.zoomToFit() 
}

const createAppViewOptions = ( 
  options: AppOptions, elements: DocumentElements 
): AppViewOptions => 
  Object.assign( {}, options, { elements })
