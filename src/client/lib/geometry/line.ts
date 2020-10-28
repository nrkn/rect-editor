import { snapToGrid } from './number'
import { Line, Point, Size } from './types'

export const lineToVector = ( 
  { x1, y1, x2, y2 }: Line
): Point => ({
  x: x2 - x1,
  y: y2 - y1
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

export const lineToPoints = (
  { x1, y1, x2, y2 }: Line
): [ Point, Point ] => {
  return [
    { x: x1, y: y1 }, { x: x2, y: y2 }
  ]
}

export const pointsToLine = (
  [ { x: x1, y: y1 }, { x: x2, y: y2 } ]: [ Point, Point ]
): Line => ({ x1, y1, x2, y2 })

export const transformLine = ( 
  line: Line, 
  transform: ( p: Point ) => Point
): Line => {
  const [ a, b ] = lineToPoints( line )

  return pointsToLine( [ transform( a ), transform( b ) ] )
}

export const getStart = ( { x1, y1 }: Line ): Point => ({ x: x1, y: y1 })

export const argsToLine = ( 
  x1: number, y1: number, x2: number, y2: number 
): Line => ({ x1, y1, x2, y2 })

export const lineToArgs = ( { x1, y1, x2, y2 }: Line ) => 
  [ x1, y1, x2, y2 ] as [ number, number, number, number ]

export const snapLineToGrid = ( 
  { x1, y1, x2, y2 }: Line,
  { width: gridW, height: gridH }: Size
): Line => {
  x1 = snapToGrid( x1, gridW )
  y1 = snapToGrid( y1, gridH )
  x2 = snapToGrid( x2, gridW )
  y2 = snapToGrid( y2, gridH )

  return { x1, y1, x2, y2 }
}

export const distance = ( line: Line ) => {
  const { x, y } = lineToVector( line )

  return Math.sqrt( x * x + y * y )
}
