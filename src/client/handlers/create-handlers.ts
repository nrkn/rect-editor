import { strictSelect } from '../lib/dom/util'
import { Actions, State } from '../types'
import { handleDrawClick } from './handle-draw-click'
import { handleDrawDrag } from './handle-draw-drag'
import { handleKeys } from './handle-keys'
import { handleMove } from './handle-move'
import { handleMoveDrag } from './handle-move-drag'
import { handlePanDrag } from './handle-pan-drag'
import { handleResizeDrag } from './handle-resize-drag'
import { handleSelectClick } from './handle-select-click'
import { handleSelectDrag } from './handle-select-drag'
import { handleSnapGrid } from './handle-snap-grid'

export const createHandlers = (state: State, actions: Actions) => {
  handleKeys(state, actions)

  handleResize(state)
  handleResetZoom(actions)
  handleWheel(state, actions)

  handlePanDrag(state)

  handleSelectClick(state, actions)
  handleSelectDrag(state, actions)
  handleMoveDrag(state, actions)

  handleDrawClick(state, actions)
  handleDrawDrag(state, actions)

  handleUndo(actions)
  handleRedo(actions)

  handleMove(state, actions)
  handleResizeDrag(state,actions)

  handleSnapGrid()
}

export const handleResize = (state: State) => {
  const viewportEl = strictSelect('#viewport')

  document.body.addEventListener('resize', () => {
    const { width, height } = viewportEl.getBoundingClientRect()

    state.viewSize({ width, height })
  })

  document.body.dispatchEvent(new Event('resize'))
}

export const handleResetZoom = (actions: Actions) => {
  const buttonEl = strictSelect('#reset-zoom')

  buttonEl.addEventListener('click', e => {
    e.preventDefault()

    actions.zoomToFit()
  })
}

export const handleUndo = (actions: Actions) => {
  const buttonEl = strictSelect('#undo')

  buttonEl.addEventListener('click', e => {
    e.preventDefault()

    actions.rects.undo()
  })
}

export const handleRedo = (actions: Actions) => {
  const buttonEl = strictSelect('#redo')

  buttonEl.addEventListener('click', e => {
    e.preventDefault()

    actions.rects.redo()
  })
}

export const handleWheel = (state: State, actions: Actions) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  viewportEl.addEventListener('wheel', e => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = state.viewTransform()

    const x = clientX - left
    const y = clientY - top

    const newScale = scale + deltaY * -0.1

    actions.zoomAt({ x, y, scale: newScale })
  })
}
