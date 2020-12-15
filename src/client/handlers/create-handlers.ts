import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { handleDrawClick } from './handle-draw-click'
import { handleDrawDrag } from './handle-draw-drag'
import { handleKeys } from './handle-keys'
import { handleLayers } from './handle-layers'
import { handleCursorMove } from './handle-cursor-move'
import { handleMoveDrag } from './handle-select-move-drag'
import { handlePanDrag } from './handle-pan-drag'
import { handleRectCollection } from './handle-rect-collection'
import { handleResizeDrag } from './handle-resize-drag'
import { handleSelectClick } from './handle-select-click'
import { handleSelectDrag } from './handle-select-drag'
import { handleSelectionChanged } from './handle-selection-changed'
import { handleSnapGrid } from './handle-snap-grid'
import { handleStyles } from './handle-styles'
import { handleViewportResize } from './handle-viewport-resize'
import { Handler } from '../lib/handlers/types'
import { createHandler } from '../lib/handlers/create-handler'
import { handlePickClick } from './handle-pick-click'
import { handlePaintClick } from './handle-paint-click'
import { handleModeChange } from './handle-mode-change'

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

  addHandler(handleKeys(state))

  addHandler(handleViewportResize(state))
  addHandler(handleResetZoom(state))
  addHandler(handleWheel(state))

  addHandler(handlePanDrag(state))

  addHandler(handleSelectClick(state))
  addHandler(handleSelectDrag(state))
  addHandler(handleMoveDrag(state))

  addHandler(handleDrawClick(state))
  addHandler(handleDrawDrag(state))

  addHandler(handleUndo(state))
  addHandler(handleRedo(state))

  addHandler(handleCursorMove(state))
  addHandler(handleResizeDrag(state))

  addHandler(handleSnapGrid())

  addHandler(handleStyles(state))

  addHandler(handleLayers(state))

  addHandler(handleRectCollection(state))

  addHandler(handleSelectionChanged(state))

  addHandler(handleModeChange(state))

  addHandler(handlePickClick(state))

  addHandler(handlePaintClick(state))

  // ---

  return handlers
}

export const handleResetZoom = (state: State) => {
  const buttonEl = strictSelect<HTMLButtonElement>('#reset-zoom')

  const click = (e: MouseEvent) => {
    e.preventDefault()

    state.zoomToFit()
  }

  const enabler = () => {
    buttonEl.addEventListener('click', click)
  }

  const disabler = () => {
    buttonEl.removeEventListener('click', click)
  }

  return createHandler('reset-zoom-click', enabler, disabler)
}

export const handleUndo = (state: State) => {
  const buttonEl = strictSelect<HTMLButtonElement>('#undo')

  const click = (e: MouseEvent) => {
    e.preventDefault()

    state.rects.undo()
  }

  const enabler = () => {
    buttonEl.addEventListener('click', click)
  }

  const disabler = () => {
    buttonEl.removeEventListener('click', click)
  }

  return createHandler('undo-click', enabler, disabler)
}

export const handleRedo = (state: State) => {
  const buttonEl = strictSelect<HTMLButtonElement>('#redo')

  const click = (e: MouseEvent) => {
    e.preventDefault()

    state.rects.redo()
  }

  const enabler = () => {
    buttonEl.addEventListener('click', click)
  }

  const disabler = () => {
    buttonEl.removeEventListener('click', click)
  }

  return createHandler('redo-click', enabler, disabler)
}

export const handleWheel = (state: State) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const wheel = (e: WheelEvent) => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = state.viewTransform()

    const x = clientX - left
    const y = clientY - top

    const newScale = scale + deltaY * -0.1

    state.zoomAt({ x, y, scale: newScale })
  }

  const enabler = () => {
    viewportEl.addEventListener('wheel', wheel)
  }

  const disabler = () => {
    viewportEl.removeEventListener('wheel', wheel)
  }

  return createHandler('pan-wheel', enabler, disabler)
}
