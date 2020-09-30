import { scalePoint, translatePoint } from './point'
import { Point, Transform } from './types'

export const transformRelativeTo = ( 
  existing: Transform, newScale: number, origin: Point
): Transform => {
  const { scale } = existing

  let newPoint = translatePoint( existing, scalePoint( origin, -1 ) )
  newPoint = scalePoint( newPoint, newScale/scale )
  newPoint = translatePoint( newPoint, origin )
  
  const transformed: Transform = Object.assign( newPoint, { scale: newScale } )

  return transformed
}