import { Line, Point } from './types'

export const lineToVector = ( 
  { x1, y1, x2, y2 }: Line
): Point => ({
  x: x2 - x1,
  y: y2 - y1
})

export const createLine = (
  { x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point
): Line => ({
  x1, y1, x2, y2
})

export const normalizeLine = (
  { x1: startX, y1: startY, x2: endX, y2: endY }: Line
): Line => {
  const x1 = Math.min( startX, endX )
  const x2 = Math.max( startX, endX )
  const y1 = Math.min( startY, endY )
  const y2 = Math.max( startY, endY )

  return { x1, y1, x2, y2 }
}

export const distance = ( line: Line ) => {
  const { x, y } = lineToVector( line )

  return Math.sqrt( x * x + y * y )
}