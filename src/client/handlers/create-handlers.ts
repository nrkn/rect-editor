import { Handler } from '../lib/handlers/types'
import { State } from '../types'

import { handleCursorMove } from './handle-cursor-move'
import { handleDrawClick } from './handle-draw-click'
import { handleDrawDrag } from './handle-draw-drag'
import { handleKeys } from './handle-keys'
import { handleLayers } from './handle-layers'
import { handleModeChange } from './handle-mode-change'
import { handlePaintClick } from './handle-paint-click'
import { handlePanDrag } from './handle-pan-drag'
import { handlePanWheel } from './handle-pan-wheel'
import { handlePickClick } from './handle-pick-click'
import { handleRectCollection } from './handle-rect-collection'
import { handleRectCollectionKeys } from './handle-rect-collection-keys'
import { handleRectCollectionRedo } from './handle-rect-collection-redo'
import { handleRectCollectionUndo } from './handle-rect-collection-undo'
import { handleSelectChange } from './handle-select-change'
import { handleSelectClick } from './handle-select-click'
import { handleSelectDrag } from './handle-select-drag'
import { handleSelectKeys } from './handle-select-keys'
import { handleSelectMoveDrag } from './handle-select-move-drag'
import { handleSelectResizeDrag } from './handle-select-resize-drag'
import { handleSnapGrid } from './handle-snap-grid'
import { handleStyles } from './handle-styles'
import { handleViewportResetZoom } from './handle-viewport-reset-zoom'
import { handleViewportResize } from './handle-viewport-resize'
import { handleVisualGrid } from './handle-visual-grid.js'
import { handleViewportKeys } from './handle-viewport-keys'

export const createHandlers = (state: State) => {
  const handlers = new Map<string, Handler>()

  const addHandler = (handler: Handler) => {
    if( handlers.has( handler.name() ) ){
      console.warn( 'Duplicate name', handler.name() )
    }

    handlers.set(handler.name(), handler)
  }

  // ---  

  // don't add modals here, or they will be displayed

  addHandler(handleCursorMove(state))

  addHandler(handleDrawClick(state))
  addHandler(handleDrawDrag(state))

  addHandler(handleKeys(state))

  addHandler(handleLayers(state))

  addHandler(handleModeChange(state))

  addHandler(handlePaintClick(state))

  addHandler(handlePanDrag(state))
  addHandler(handlePanWheel(state))

  addHandler(handlePickClick(state))

  addHandler(handleRectCollectionKeys(state))
  addHandler(handleRectCollectionRedo(state))
  addHandler(handleRectCollectionUndo(state))
  addHandler(handleRectCollection(state))

  addHandler(handleSelectChange(state)) 
  addHandler(handleSelectClick(state))
  addHandler(handleSelectDrag(state))
  addHandler(handleSelectKeys(state))
  addHandler(handleSelectMoveDrag(state))
  addHandler(handleSelectResizeDrag(state))

  addHandler(handleSnapGrid(state))
  addHandler(handleVisualGrid(state))

  addHandler(handleStyles(state))

  addHandler(handleViewportResetZoom(state))
  addHandler(handleViewportResize(state))
  addHandler(handleViewportKeys(state))

  // ---

  return handlers
}


