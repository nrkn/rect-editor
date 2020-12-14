import { Point } from '../geometry/types'
import { createHandler } from './create-handler'
import { DragOptions, HandleDrag } from './types'
import { getPosition } from './util'

export const handleDrag: HandleDrag = ( 
  name: string, el, onDrag, opts 
) => {
  const {
    onStart, onEnd, transformPoint, predicate
  } = Object.assign( {}, defaultOptions, opts )
  
  let start: Point | null = null
  let prev: Point | null = null
  let end: Point | null = null

  const down = ( e: MouseEvent ) => {
    if ( !predicate( e, 'start' ) ) return

    const bounds = el.getBoundingClientRect()

    start = end = prev = transformPoint( getPosition( e, bounds ) )

    onStart( start, end, prev )
  }

  const move = ( e: MouseEvent ) => {
    if ( !predicate( e, 'drag' ) ) return
    if( start === null || prev === null || end === null ) return

    const bounds = el.getBoundingClientRect()

    prev = end
    end = transformPoint( getPosition( e, bounds ) )
    onDrag( start, end, prev )
  }

  const up = ( e: MouseEvent ) => {
    if ( !predicate( e, 'end' ) ) return
    if( start === null || prev === null || end === null  ) return

    onEnd( start, end, prev )

    start = null
    prev = null
    end = null
  }

  const enabler = () => {
    el.addEventListener( 'mousedown', down )
    el.addEventListener( 'mousemove', move )
    el.addEventListener( 'mouseup', up )
  }

  const disabler = () => {
    el.removeEventListener( 'mousedown', down )
    el.removeEventListener( 'mousemove', move )
    el.removeEventListener( 'mouseup', up )
  }

  return createHandler( name, enabler, disabler )
}

const defaultOptions: DragOptions = {
  onStart: () => {}, 
  onEnd: () => {}, 
  transformPoint: p => p,
  predicate: () => true
}
