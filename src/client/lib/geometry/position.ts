import { isXPosition, isYPosition } from './predicates'
import { Rect, XPosition, YPosition } from './types'

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
