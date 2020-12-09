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

export const createHandlers = (state: State) => {
  handleKeys(state)

  handleViewportResize(state)
  handleResetZoom(state)
  handleWheel(state)

  handlePanDrag(state)

  handleSelectClick(state)
  handleSelectDrag(state)
  handleMoveDrag(state)

  handleDrawClick(state)
  handleDrawDrag(state)

  handleUndo(state)
  handleRedo(state)

  handleCursorMove(state)
  handleResizeDrag(state)

  handleSnapGrid()

  handleStyles(state)

  handleLayers(state)

  handleRectCollection(state)

  handleSelectionChanged(state)
}

export const handleResetZoom = (state: State) => {
  const buttonEl = strictSelect('#reset-zoom')

  buttonEl.addEventListener('click', e => {
    e.preventDefault()

    state.zoomToFit()
  })
}

export const handleUndo = (state: State) => {
  const buttonEl = strictSelect('#undo')

  buttonEl.addEventListener('click', e => {
    e.preventDefault()

    state.rects.undo()
  })
}

export const handleRedo = (state: State) => {
  const buttonEl = strictSelect('#redo')

  buttonEl.addEventListener('click', e => {
    e.preventDefault()

    state.rects.redo()
  })
}

export const handleWheel = (state: State) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  viewportEl.addEventListener('wheel', e => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = state.viewTransform()

    const x = clientX - left
    const y = clientY - top

    const newScale = scale + deltaY * -0.1

    state.zoomAt({ x, y, scale: newScale })
  })
}
