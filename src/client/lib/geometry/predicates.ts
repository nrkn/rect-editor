import { XPosition, xPositionNames, YPosition, yPositionNames } from './types'

export const isXPosition = ( value: any ): value is XPosition => 
  xPositionNames.includes( value )

export const isYPosition = ( value: any ): value is YPosition =>
  yPositionNames.includes( value )
