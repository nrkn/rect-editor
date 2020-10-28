import { attr, strictSelect } from '../../lib/dom/util'
import { getViewBoxRect } from '../../lib/dom/geometry'
import { lineToVector, normalizeLine, snapLineToGrid } from '../../lib/geometry/line'
import { AppState } from '../types'
import { applyTransform, localToGrid } from '../geometry'
import { keyHandler } from './key-handler'
import { randomId } from '../../lib/util'
import { translateRect } from '../../lib/geometry/rect'
import { newCommand } from '../commands'
import { switchMode } from '../actions/mode'
import { zoomAt } from '../actions/zoom'

import { 
  selectNone, selectRect, isSelected, toggleRect 
} from '../actions/select'

import { createRectEl, findRectAt, setRectElRect, svgRectToRect } from '../dom/rects'
import { createPointerEmitter } from '../../lib/events/pointer-emitter'
import { Point } from '../../lib/geometry/types'

export const initIOEvents = (state: AppState) => {
  const { dom, options, dragData } = state
  const { viewportEl, groupEl } = dom
  
  const emitter = createPointerEmitter( viewportEl )

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
    const handled = keyHandler(state, e.key)

    if (handled) e.preventDefault()
  })

  window.addEventListener('keyup', e => {
    state.keys[e.key] = false
  })

  emitter.down.on( () => {
  })

  emitter.up.on( () => {
    if (dragData.creatingElId) {
      const creatingEl = strictSelect<SVGRectElement>(
        `#${dragData.creatingElId}`, state.dom.groupEl
      )

      const { width, height } = creatingEl

      if (width.baseVal.value === 0 || height.baseVal.value === 0) {
        creatingEl.remove()
        dragData.creatingElId = null

        return
      }

      selectNone(state)
      selectRect(state, creatingEl)

      newCommand(state,
        {
          type: 'add',
          elements: [
            {
              id: dragData.creatingElId,
              rect: svgRectToRect(creatingEl)
            }
          ]
        }
      )

      dragData.creatingElId = null
    }

    dragData.dragLine = null
    dragData.draggingRect = null
    dragData.selectingRect = null
  })
  
  emitter.move.on( ({ position, isDragging }) => {
    // set cursors here - or use CSS?

    if (!isDragging) return

    const { x: lx, y: ly } = normalizeLocal(state, position)

    if (dragData.dragLine) {
      dragData.dragLine.x2 = lx
      dragData.dragLine.y2 = ly
    } else {
      dragData.dragLine = { x1: lx, y1: ly, x2: lx, y2: ly }
    }

    if (state.mode === 'pan') {
      const { x: dX, y: dY } = lineToVector(dragData.dragLine)

      state.transform.x += dX
      state.transform.y += dY

      applyTransform(state)

      return
    }

    if (state.mode === 'draw') {
      let creatingEl: SVGRectElement

      if (dragData.creatingElId) {
        creatingEl = strictSelect<SVGRectElement>(
          `#${dragData.creatingElId}`, state.dom.groupEl
        )        
      } else {        
        dragData.creatingElId = randomId()

        creatingEl = createRectEl( dragData.creatingElId )

        groupEl.append(creatingEl)
      }

      const line = normalizeLine(
        snapLineToGrid(dragData.dragLine, options.snap)
      )

      const { x1: x, y1: y } = line
      let { x: width, y: height } = lineToVector(line)

      if (state.keys.Shift) {
        const max = Math.max(width, height)

        width = max
        height = max
      }

      attr(creatingEl, { x, y, width, height })

      return
    }

    if (state.mode === 'select') {
      if (!dragData.draggingRect) {
        const selectedRectEl = findRectAt(state, { x: lx, y: ly })

        if (selectedRectEl === undefined) return

        if (!isSelected(selectedRectEl)) return

        const { id } = selectedRectEl

        const initialRect = svgRectToRect(selectedRectEl)

        dragData.draggingRect = { initialRect, id }

        return
      }

      const selectedRectEl = strictSelect<SVGRectElement>(
        `#${dragData.draggingRect.id}`
      )

      const line = snapLineToGrid(dragData.dragLine, options.snap)

      const delta = lineToVector(line)

      const newRectElRect = translateRect(
        dragData.draggingRect.initialRect, delta
      )

      setRectElRect(selectedRectEl, newRectElRect)

      // now translate selection as well
      // TODO: this is lazy and bad lol
      selectNone(state)
      selectRect(state, selectedRectEl)

      return
    }
  })

  emitter.tap.on( ({ position }) => {
    const localPosition = normalizeLocal(state, position)

    const selectedRectEl = findRectAt(state, localPosition)

    if (state.mode === 'pan') {
      selectNone(state)

      return
    }

    if (state.mode === 'draw' && selectedRectEl !== undefined) {
      selectNone(state)
      selectRect(state, selectedRectEl)
      switchMode(state, 'select')

      return
    }

    if (state.mode === 'select') {
      const selectedRectEl = findRectAt(state, localPosition)

      if (selectedRectEl === undefined) {
        selectNone(state)
      } else {
        if (state.keys.Shift) {
          toggleRect(state, selectedRectEl)
        } else {
          selectNone(state)
          selectRect(state, selectedRectEl)
        }
      }

      return
    }
  })
}

const normalizeLocal = (state: AppState, { x, y }: Point ) => {  
  const viewBoxRect = getViewBoxRect(state.dom.svgEl)

  return localToGrid(
    x, y, state.transform, viewBoxRect
  )
}
