import { createInputEvents } from '../../lib/create-events'
import { rect } from '../../lib/dom/s'
import { attr, strictSelect } from '../../lib/dom/util'
import { getViewBoxRect } from '../../lib/dom/geometry'
import { lineToVector, normalizeLine, snapLineToGrid } from '../../lib/geometry/line'
import { findRectAt } from '../rects'
import { AppState } from '../types'
import { isSelected, newAction, selectNone, selectRect, setRectElRect, switchMode, toggleRect, zoomAt } from '../actions'
import { applyTransform, localToGrid, svgRectToRect } from '../geometry'
import { keyHandler } from './key'
import { randomId } from '../../lib/util'
import { translateRect } from '../../lib/geometry/rect'

export const initIOEvents = (state: AppState) => {
  const { dom, options, dragData } = state
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
    const handled = keyHandler(state, e.key)

    if( handled ) e.preventDefault()
  })

  window.addEventListener('keyup', e => {
    state.keys[e.key] = false
  })

  event.on('down', () => {
    
  })

  event.on('up', () => {   
    if (dragData.creatingRectEl) {
      const { width, height } = dragData.creatingRectEl

      if (width.baseVal.value === 0 || height.baseVal.value === 0) {
        dragData.creatingRectEl.remove()
        dragData.creatingRectEl = null

        return
      }

      selectNone(state)
      selectRect(state, dragData.creatingRectEl)

      newAction(state,
        {
          type: 'add',
          elements: [
            {
              id: dragData.creatingRectEl.id,
              rect: svgRectToRect(dragData.creatingRectEl)   
            }
          ]
        }
      )

      dragData.creatingRectEl = null
    }

    dragData.dragLine = null
    dragData.draggingRect = null
  })

  event.on('move', ({ position, dragging }) => {
    // set cursors here - or use CSS?
    
    if (!dragging) return

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
      if (!dragData.creatingRectEl) {
        dragData.creatingRectEl = rect({
          id: randomId(),
          class: 'draw-rect',
          fill: 'rgba( 255, 255, 255, 0.75 )'
        })

        groupEl.append(dragData.creatingRectEl)
      }

      const line = normalizeLine(
        snapLineToGrid( dragData.dragLine, options.snap )        
      )

      const { x1: x, y1: y } = line
      let { x: width, y: height } = lineToVector(line)

      if( state.keys.Shift ){
        const max = Math.max( width, height )

        width = max
        height = max
      }

      attr(dragData.creatingRectEl, { x, y, width, height })

      return
    }

    if( state.mode === 'select' ){
      console.log( 'dragging in select mode' )

      if( !dragData.draggingRect ){
        const selectedRectEl = findRectAt( state, { x: lx, y: ly } )

        if( selectedRectEl === undefined ) return
        
        console.log( 'found a rect' )
        
        if( !isSelected( selectedRectEl ) ) return

        console.log( 'found a selected rect' )

        const { id } = selectedRectEl

        const initialRect = svgRectToRect( selectedRectEl )

        dragData.draggingRect = { initialRect, id }

        return
      }

      const selectedRectEl = strictSelect<SVGRectElement>( 
        `#${ dragData.draggingRect.id }` 
      )

      const line = snapLineToGrid(dragData.dragLine, options.snap)

      const delta = lineToVector(line)

      const newRectElRect = translateRect( 
        dragData.draggingRect.initialRect, delta 
      )      

      console.log( 'delta', delta )
      console.log( 'initial rect', dragData.draggingRect.initialRect )
      console.log( 'new rect', newRectElRect )
      
      setRectElRect( selectedRectEl, newRectElRect )      

      // now translate selection as well
      // TODO: this is lazy and bad lol
      selectNone( state )
      selectRect( state, selectedRectEl )

      return
    }
  })

  event.on('tap', ({ position }) => {
    const localPosition = normalizeLocal(state, position)

    const selectedRectEl = findRectAt(state, localPosition)

    if( state.mode === 'pan' ){
      selectNone( state )

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

      if( selectedRectEl === undefined ){
        selectNone( state )
      } else {
        if( state.keys.Shift ){
          toggleRect( state, selectedRectEl)
        } else {
          selectNone( state )
          selectRect(state, selectedRectEl)
        }
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
