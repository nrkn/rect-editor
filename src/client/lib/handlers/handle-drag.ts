import { Point } from '../geometry/types'
import { DragOptions, HandleDrag } from './types'
import { getPosition } from './util'

export const handleDrag: HandleDrag = ( el, onDrag, opts ) => {
  const {
    onStart, onEnd, transformPoint, predicate
  } = Object.assign( {}, defaultOptions, opts )
  
  let start: Point | null = null
  let prev: Point | null = null
  let end: Point | null = null

  el.addEventListener('mousedown', e => {
    if ( !predicate( e, 'start' ) ) return

    const bounds = el.getBoundingClientRect()

    start = end = prev = transformPoint( getPosition( e, bounds ) )

    onStart( start, end, prev )
  })

  el.addEventListener('mousemove', e => {
    if ( !predicate( e, 'drag' ) ) return
    if( start === null || prev === null || end === null ) return

    const bounds = el.getBoundingClientRect()

    prev = end
    end = transformPoint( getPosition( e, bounds ) )
    onDrag( start, end, prev )
  })

  el.addEventListener('mouseup', e => {
    if ( !predicate( e, 'end' ) ) return
    if( start === null || prev === null || end === null  ) return

    onEnd( start, end, prev )

    start = null
    end = null
  })
}

const defaultOptions: DragOptions = {
  onStart: () => {}, 
  onEnd: () => {}, 
  transformPoint: p => p,
  predicate: () => true
}
