import { xPositionNames, yPositionNames } from './consts'
import { Point, Rect, Size, XPosition, YPosition } from './types'

export const isXPosition = ( value: any ): value is XPosition => 
  xPositionNames.includes( value )

export const isYPosition = ( value: any ): value is YPosition =>
  yPositionNames.includes( value )

export const isPoint = ( value: any ): value is Point =>
  value && typeof value.x === 'number' && typeof value.y === 'number'

export const isSize = ( value: any ): value is Size => 
  value && typeof value.width === 'number' && typeof value.height === 'number'

export const isRect = ( value: any ): value is Rect =>
  isPoint( value ) && isSize( value )