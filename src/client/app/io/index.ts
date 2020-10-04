import { createInputEvents } from '../../lib/create-events'
import { rect } from '../../lib/dom/s'
import { attr } from '../../lib/dom/util'
import { getViewBoxRect } from '../../lib/dom/geometry'
import { lineToVector, snapLineToGrid } from '../../lib/geometry/line'
import { Line } from '../../lib/geometry/types'
import { findRectAt } from '../rects'
import { AppState } from '../types'
import { selectNone, selectRect, switchMode, zoomAt } from '../actions'
import { applyTransform, localToGrid } from '../geometry'
import { keyHandler } from './key'

export const initIOEvents = (state: AppState) => {
  const { dom, options } = state
  const { viewportEl, groupEl } = dom
  const event = createInputEvents( { target: viewportEl, preventDefault: true } )

  let dragLine: Line | null = null
  let creatingRectEl: SVGRectElement | null = null

  viewportEl.addEventListener('wheel', e => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = state.transform

    const x = clientX - left
    const y = clientY - top

    const newScale = scale + deltaY * -0.1

    zoomAt( state, { x, y, scale: newScale } )
  })

  window.addEventListener('keydown', e => {
    keyHandler( state, e.key )
  })


  event.on('down', ({ position }) => {
    console.log('down', { position })
  })

  event.on('up', ({ position }) => {
    console.log('up', { position })

    if( creatingRectEl ){
      const { width, height } = creatingRectEl

      if( width.baseVal.value === 0 || height.baseVal.value === 0 ){
        creatingRectEl.remove()
      } 

      selectNone( state )
      selectRect( state, creatingRectEl )

      creatingRectEl = null
    }

    dragLine = null    
  })

  event.on('move', ({ position, dragging }) => {
    if (!dragging) return

    const { x, y } = normalizeLocal(state, position)

    if (dragLine) {
      dragLine.x2 = x
      dragLine.y2 = y
    } else {
      dragLine = { x1: x, y1: y, x2: x, y2: y }
    }

    if (state.mode === 'pan') {
      const { x: dX, y: dY } = lineToVector(dragLine)

      state.transform.x += dX
      state.transform.y += dY

      applyTransform(state)

      return
    }

    if (state.mode === 'draw') {
      if (!creatingRectEl) {
        creatingRectEl = rect({
          class: 'draw-rect',
          fill: 'rgba( 255, 255, 255, 0.75 )'
        })

        groupEl.append(creatingRectEl)
      }

      const { x1, x2, y1, y2 } = dragLine

      if( x1 >= x2 || y1 >= y2 ) return

      const line = snapLineToGrid( dragLine, options.snap )

      const { x1: x, y1: y } = line
      const { x: width, y: height } = lineToVector(line)

      attr( creatingRectEl, { x, y, width, height } )
    }
  })

  event.on('tap', ({ position }) => {
    selectNone( state )
    
    const localPosition = normalizeLocal(state, position)

    const selectedRectEl = findRectAt( state, localPosition )

    if( state.mode === 'draw' && selectedRectEl !== undefined ){
      switchMode( state, 'select' )
    }

    if( state.mode === 'select' ){
      const selectedRectEl = findRectAt( state, localPosition )

      if( selectedRectEl !== undefined ){
        selectRect( state, selectedRectEl )
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
