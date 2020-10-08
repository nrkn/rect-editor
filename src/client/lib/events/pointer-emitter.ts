import { createEmitter } from '.'
import { argsToLine, distance } from '../geometry/line'
import { rectContainsPoint } from '../geometry/rect'
import { Point } from '../geometry/types'
import { PointerEmitterOptions, PointerEvent } from './types'

export const createPointerEmitter = (
  target: HTMLElement, options: Partial<PointerEmitterOptions> = {}
) => {
  const {
    preventDefault, tapDistanceThreshold, tapDelay
  } = Object.assign({}, defaultOptions, options)

  const down = createEmitter<PointerEvent>()
  const up = createEmitter<PointerEvent>()
  const move = createEmitter<PointerEvent>()
  const tap = createEmitter<PointerEvent>()

  let isDragging = false
  let isAttached = false  
  let lastTime: number
  let lastPosition: Point | null

  const downListener = ( e: MouseEvent ) => {
    isDragging = true

    const event = createEvent( e )
    const { x, y } = event.position
    
    lastPosition = { x, y }
    lastTime = Date.now()

    down.emit( event )
  }

  const upListener = ( e: MouseEvent ) => {
    const wasDragging = isDragging

    const event = createEvent( e )

    if( wasDragging || event.isInside ){
      up.emit( event )
    }

    if (lastPosition != null) {
      const nowTime = Date.now()
      const delta = nowTime - lastTime
      const { x: x1, y: y1 } = event.position
      const { x: x2, y: y2 } = lastPosition 

      const dist = distance({ x1, y1, x2, y2 })
      
      if (delta <= tapDelay && dist < tapDistanceThreshold) {
        tap.emit( event )
      }
      
      lastPosition = null
    }

    isDragging = false
  }

  const moveListener = ( e: MouseEvent ) => {
    const event = createEvent( e )
    const bounds = target.getBoundingClientRect()
    const isInside = rectContainsPoint( bounds, event.position )

    if (isInside) {
      isDragging = true
    }

    if( isDragging || event.isInside ){
      move.emit( event )
    }
  }

  const enable = () => {
    if( isAttached ) return

    target.addEventListener('mousedown', downListener )
    window.addEventListener('mouseup', upListener)
    window.addEventListener('mousemove', moveListener)

    if( preventDefault ){
      window.addEventListener( 
        'dragstart', preventDefaultListener, { passive: false } 
      )

      document.addEventListener(
        'touchmove', preventDefaultListener, { passive: false }
      )      
    }

    isAttached = true
  }

  const preventDefaultListener = ( event: Event ) => {
    event.preventDefault()

    return false
  }

  const disable = () => {
    if( !isAttached ) return

    target.removeEventListener('mousedown', downListener)
    window.removeEventListener('mouseup', upListener)
    window.removeEventListener('mousemove', moveListener)

    if (preventDefault) {
      window.removeEventListener('dragstart', preventDefaultListener)
      document.removeEventListener('touchmove', preventDefaultListener)
    }

    isAttached = false
  }

  const createEvent = (  mouseEvent: MouseEvent ) => {
    const bounds = target.getBoundingClientRect()
    const position = getPosition( mouseEvent, bounds )
    const isInside = rectContainsPoint( bounds, position )

    const event: PointerEvent = { position, isDragging, isInside }

    return event
  }

  enable()

  return { up, down, move, tap, enable, disable }
}

const getPosition = ( event: MouseEvent, bounds: DOMRect ) => {
  const { clientX, clientY } = event
  const x = clientX - bounds.left
  const y = clientY - bounds.top  
  const point: Point = { x, y }
  
  return point
}

const defaultOptions: PointerEmitterOptions = {
  preventDefault: true,
  tapDistanceThreshold: 10,
  tapDelay: 300
}
