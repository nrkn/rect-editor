import { Size } from 'object-fit-math/dist/types'
import { snapToGrid } from './number'
import { translatePoint } from './point'
import { Point, Rect } from './types'

export const integerRect = ( { x, y, width, height }: Rect ): Rect => {
  x = Math.floor( x )
  y = Math.floor( y )
  width = Math.floor( width )
  height = Math.floor( height )

  return { x, y, width, height }
}

export const translateRect = ( rect: Rect, { x, y }: Point ) => {
  const translatedPoint = translatePoint( rect, { x, y } )

  return Object.assign( {}, rect, translatedPoint )
}

export const scaleRect = ( 
  { x, y, width, height }: Rect, scale: number 
): Rect => {
  x *= scale
  y *= scale
  width *= scale
  height *= scale

  return { x, y, width, height }
}

export const rectContainsPoint = (
  rect: Rect, point: Point
) => {
  if( point.x < rect.x ) return false
  if( point.y < rect.y ) return false
  if( point.x > ( rect.x + rect.width ) ) return false
  if( point.y > ( rect.y + rect.height ) ) return false

  return true
}

export const snapRect = ( { x, y, width, height }: Rect, snapSize: Size ) => {
  x = snapToGrid( x, snapSize.width )
  y = snapToGrid( y, snapSize.height )
  width = snapToGrid( width, snapSize.width )
  height = snapToGrid( height, snapSize.height )

  const rect: Rect = { x, y, width, height }

  return rect
}