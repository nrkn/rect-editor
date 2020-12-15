import { State } from '../types'
import { handleDrawClick } from './handle-draw-click'
import { handleDrawDrag } from './handle-draw-drag'
import { handleKeys } from './handle-keys'
import { handleLayers } from './handle-layers'
import { handleCursorMove } from './handle-cursor-move'
import { handleSelectMoveDrag } from './handle-select-move-drag'
import { handlePanDrag } from './handle-pan-drag'
import { handleRectCollection } from './handle-rect-collection'
import { handleSelectResizeDrag } from './handle-select-resize-drag'
import { handleSelectClick } from './handle-select-click'
import { handleSelectDrag } from './handle-select-drag'
import { handleSelectionChanged } from './handle-selection-changed'
import { handleSnapGrid } from './handle-snap-grid'
import { handleStyles } from './handle-styles'
import { handleViewportResize } from './handle-viewport-resize'
import { Handler } from '../lib/handlers/types'
import { handlePickClick } from './handle-pick-click'
import { handlePaintClick } from './handle-paint-click'
import { handleModeChange } from './handle-mode-change'
import { handleViewportResetZoom } from './handle-viewport-reset-zoom'
import { handleRectCollectionUndo } from './handle-rect-collection-undo'
import { handleRectCollectionRedo } from './handle-rect-collection-redo'
import { handlePanWheel } from './handle-pan-wheel'
import { handleRectCollectionKeys } from './handle-rect-collection-keys'

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

  addHandler(handleSelectClick(state))
  addHandler(handleSelectDrag(state))
  addHandler(handleSelectMoveDrag(state))
  addHandler(handleSelectResizeDrag(state))

  addHandler(handleSelectionChanged(state)) 

  addHandler(handleSnapGrid())

  addHandler(handleStyles(state))

  addHandler(handleViewportResetZoom(state))
  addHandler(handleViewportResize(state))

  // ---

  return handlers
}


