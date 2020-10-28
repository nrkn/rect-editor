import { pipeStatePartial } from '../../lib/state'
import { EventedState } from '../../lib/state/types'
import { AppActions, AppModel } from '../app/types'
import { DocumentActions } from '../document/types'
import { createToolsView } from './tools-view'

export const startTools = ( 
  appState: EventedState<AppModel>, appActions: AppActions, 
  documentActions: DocumentActions
) => {
  const toolsView = createToolsView( appState.set, appActions, documentActions )

  pipeStatePartial( appState.on, toolsView )
}
