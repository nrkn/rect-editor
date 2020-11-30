import { minDragDistance, minDragTime } from '../consts'
import { strictSelect } from '../lib/dom/util'
import { createLine, distance } from '../lib/geometry/line'
import { Point } from '../lib/geometry/types'
import { getPosition } from './util'

export const handleClick = (
  transformPoint: ( p: Point ) => Point,
  onClick: ( button: number, point: Point ) => void
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  
  let startTime: number
  let startPosition: Point
  let button: number

  viewportEl.addEventListener( 'mousedown', e => {
    const bounds = viewportEl.getBoundingClientRect()

    button = e.button
    startTime = Date.now()
    startPosition = transformPoint( getPosition( e, bounds ) )
  })

  viewportEl.addEventListener( 'mouseup', e => {
    const bounds = viewportEl.getBoundingClientRect()

    const endTime = Date.now()

    if( (endTime - startTime) > minDragTime ) return

    const endPosition = transformPoint( getPosition( e, bounds ) )

    const line = createLine( startPosition, endPosition )
    const dist = Math.abs( distance( line ) )

    if( dist > minDragDistance ) return

    onClick( button, endPosition )
  })
} 
