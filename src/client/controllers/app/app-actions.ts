import { zoomAt, zoomToFit } from '../../geometry'
import { Size, Transform } from '../../lib/geometry/types'
import { GetStateRecord, State } from '../../lib/state/types'
import { DocumentViewModel } from '../document/types'
import { AppActions, AppModel, AppOptions } from './types'

export const createAppActions = ( 
  state: State<AppModel>, getDocumentState: GetStateRecord<DocumentViewModel>, 
  options: AppOptions 
) => {
  const actions: AppActions = {
    zoomToFit: () => {
      const viewportSize = state.get.viewportSize()
      const transform = zoomToFit( viewportSize, getDocumentState.gridSize() )
  
      state.set.viewportTransform( transform )
    },
    zoomAt: (transform: Transform) => {
      const viewportTransform = state.get.viewportTransform()
  
      transform = zoomAt( viewportTransform, transform, options.minScale )
  
      state.set.viewportTransform( transform )
    }
  }

  return actions
}
