import { clone } from '../util'
import { isXPosition, isYPosition } from './predicates'
import { growRect, rectContainsPoint, rectToSidesRect } from './rect'
import { Point, Positions, Rect, XPosition, YPosition } from './types'

export const getXPosition = ({ x, width }: Rect, position: XPosition) => {
  switch (position) {
    case 'left': return x
    case 'right': return x + width
    case 'xCenter': return x + width / 2
  }
}

export const getYPosition = ({ y, height }: Rect, position: YPosition) => {
  switch (position) {
    case 'top': return y
    case 'bottom': return y + height
    case 'yCenter': return y + height / 2
  }
}

export const findXPosition = ( values: string[] ) => {
  for( let i = 0; i < values.length; i++ ){
    const value = values[ i ]

    if( isXPosition( value ) ) return value
  }
}

export const findYPosition = ( values: string[] ) => {
  for( let i = 0; i < values.length; i++ ){
    const value = values[ i ]

    if( isYPosition( value ) ) return value
  }
}

export const getEdgePositions = ( 
  rect: Rect, growBy: number, point: Point
) => {    
  // const outerRect = growRect( rect, growBy )
  // const innerRect = growRect( rect, -growBy )
  const outerRect = growRect( rect, growBy * 2 )
  const innerRect = clone( rect )

  if( !rectContainsPoint( outerRect, point ) ) return

  const positions: Positions = [ 'xCenter', 'yCenter' ]

  if( rectContainsPoint( innerRect, point ) ) return positions
    
  const outerSides = rectToSidesRect( outerRect )
  const innerSides = rectToSidesRect( innerRect )

  if( point.y >= outerSides.top && point.y <= innerSides.top ){
    positions[ 1 ] = 'top'      
  }

  if( point.x >= innerSides.right && point.x <= outerSides.right ){
    positions[ 0 ] = 'right'
  }

  if( point.y >= innerSides.bottom && point.y <= outerSides.bottom ){
    positions[ 1 ] = 'bottom'
  }

  if( point.x >= outerSides.left && point.x <= innerSides.left ){
    positions[ 0 ] = 'left'
  }

  return positions
}