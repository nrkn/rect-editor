import { snapToGrid } from './number'
import { Point, Size } from './types'

export const translatePoint = ( 
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point
): Point => ({
  x: x1 + x2,
  y: y1 + y2
})

export const scalePoint = ( 
  { x, y }: Point, scale: number 
): Point => ({
  x: x * scale,
  y: y * scale
})

export const snapPointToGrid = (
  { x, y }: Point, { width: gridW, height: gridH }: Size
): Point => {
  x = snapToGrid( x, gridW )
  y = snapToGrid( y, gridH )

  return { x, y }
}

export const deltaPoint = (
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point
): Point => ({
  x: x1 - x2,
  y: y1 - y2
})