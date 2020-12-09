import { createLine, distance } from '../geometry/line'
import { Point } from '../geometry/types'
import { HandleClick, HandleClickOptions } from './types'
import { getPosition } from './util'

export const handleClick: HandleClick = ( el, onClick, opts ) => { 
  const { 
    transformPoint, predicate, minDragDistance, minDragTime 
  } = Object.assign( {}, defaultOptions, opts )

  let startTime: number
  let startPosition: Point
  let startButton: number

  el.addEventListener( 'mousedown', e => {
    const bounds = el.getBoundingClientRect()

    startButton = e.button
    startTime = Date.now()
    startPosition = transformPoint( getPosition( e, bounds ) )
  })

  el.addEventListener( 'mouseup', e => {
    const bounds = el.getBoundingClientRect()

    const endTime = Date.now()

    if( (endTime - startTime) > minDragTime ) return

    const endPosition = transformPoint( getPosition( e, bounds ) )

    const line = createLine( startPosition, endPosition )
    const dist = Math.abs( distance( line ) )

    if( dist > minDragDistance ) return

    if( predicate( endPosition, startButton, e ) ){
      onClick( endPosition, startButton, e )
    }
  })
} 

const defaultOptions: HandleClickOptions = {
  transformPoint: ( p: Point ) => p,
  predicate: () => true,
  minDragDistance: 10,
  minDragTime: 300  
}
