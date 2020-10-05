import { createInputEvents } from '../../lib/create-events'
import { rect } from '../../lib/dom/s'
import { attr } from '../../lib/dom/util'
import { getViewBoxRect } from '../../lib/dom/geometry'
import { lineToVector, snapLineToGrid } from '../../lib/geometry/line'
import { findRectAt } from '../rects'
import { AppState } from '../types'
import { newAction, selectNone, selectRect, switchMode, zoomAt } from '../actions'
import { applyTransform, localToGrid, svgRectToRect } from '../geometry'
import { keyHandler } from './key'
import { randomId } from '../../lib/util'

export const initIOEvents = (state: AppState) => {
  const { dom, options } = state
  const { viewportEl, groupEl } = dom
  const event = createInputEvents({ target: viewportEl, preventDefault: true })

  viewportEl.addEventListener('wheel', e => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = state.transform

    const x = clientX - left
    const y = clientY - top

    const newScale = scale + deltaY * -0.1

    zoomAt(state, { x, y, scale: newScale })
  })

  window.addEventListener('keydown', e => {
    state.keys[e.key] = true
    keyHandler(state, e.key)
  })

  window.addEventListener('keyup', e => {
    state.keys[e.key] = false
  })

  event.on('down', ({ position }) => {
    console.log('down', { position })
  })

  event.on('up', ({ position }) => {
    console.log('up', { position })

    if (state.creatingRectEl) {
      const { width, height } = state.creatingRectEl

      if (width.baseVal.value === 0 || height.baseVal.value === 0) {
        state.creatingRectEl.remove()
        state.creatingRectEl = null

        return
      }

      selectNone(state)
      selectRect(state, state.creatingRectEl)

      newAction(state,
        {
          type: 'add',
          id: state.creatingRectEl.id,
          rect: svgRectToRect(state.creatingRectEl)
        }
      )

      state.creatingRectEl = null
    }

    state.dragLine = null
  })

  event.on('move', ({ position, dragging }) => {
    if (!dragging) return

    const { x, y } = normalizeLocal(state, position)

    if (state.dragLine) {
      state.dragLine.x2 = x
      state.dragLine.y2 = y
    } else {
      state.dragLine = { x1: x, y1: y, x2: x, y2: y }
    }

    if (state.mode === 'pan') {
      const { x: dX, y: dY } = lineToVector(state.dragLine)

      state.transform.x += dX
      state.transform.y += dY

      applyTransform(state)

      return
    }

    if (state.mode === 'draw') {
      if (!state.creatingRectEl) {
        state.creatingRectEl = rect({
          id: randomId(),
          class: 'draw-rect',
          fill: 'rgba( 255, 255, 255, 0.75 )'
        })

        groupEl.append(state.creatingRectEl)
      }

      const { x1, x2, y1, y2 } = state.dragLine

      if (x1 >= x2 || y1 >= y2) return

      const line = snapLineToGrid(state.dragLine, options.snap)

      const { x1: x, y1: y } = line
      const { x: width, y: height } = lineToVector(line)

      attr(state.creatingRectEl, { x, y, width, height })
    }
  })

  event.on('tap', ({ position }) => {
    selectNone(state)

    const localPosition = normalizeLocal(state, position)

    const selectedRectEl = findRectAt(state, localPosition)

    if (state.mode === 'draw' && selectedRectEl !== undefined) {
      switchMode(state, 'select')
    }

    if (state.mode === 'select') {
      const selectedRectEl = findRectAt(state, localPosition)

      if (selectedRectEl !== undefined) {
        selectRect(state, selectedRectEl)
      }

      return
    }
  })
}

const normalizeLocal = (state: AppState, [x, y]: [number, number]) => {
  const viewBoxRect = getViewBoxRect(state.dom.svgEl)

  return localToGrid(
    x, y, state.transform, viewBoxRect
  )
}
