import { scalePoint, translatePoint } from './point'
import { Point, ScaleTransform } from './types'

export const transformRelativeTo = ( 
  existing: ScaleTransform, newScale: number, origin: Point
): ScaleTransform => {
  const { scale } = existing

  let newPoint = translatePoint( existing, scalePoint( origin, -1 ) )
  newPoint = scalePoint( newPoint, newScale/scale )
  newPoint = translatePoint( newPoint, origin )
  
  const transformed: ScaleTransform = Object.assign( 
    newPoint, { scale: newScale } 
  )

  return transformed
}

export const translateAndScalePoint = (
  { x, y }: Point,
  { x: tx, y: ty, scale }: ScaleTransform
): Point => {
  x -= tx
  y -= ty

  x /= scale
  y /= scale

  return { x, y }
}

export const zoomAt = ( 
  transform: ScaleTransform, 
  { scale, x, y }: ScaleTransform, 
  minScale: number 
) => {
  if( scale < minScale ) scale = minScale
  
  const newTransform = transformRelativeTo(
    transform, scale, { x, y }
  )

  return Object.assign( {}, transform, newTransform)
}
