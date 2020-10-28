export type Point = { x: number, y: number }

export type Transform = Point & { scale: number }

export type Size = { width: number, height: number }

export type Rect = Point & Size

export type PositionRect = {
  left: number
  top: number
  right: number
  bottom: number
}

export type Line = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export const LEFT = 'left'
export const RIGHT = 'right'
export const TOP = 'top'
export const BOTTOM = 'bottom'
export const XCENTER = 'xCenter'
export const YCENTER = 'yCenter'

export type Left = typeof LEFT
export type Right = typeof RIGHT
export type Top = typeof TOP
export type Bottom = typeof BOTTOM
export type XCenter = typeof XCENTER
export type YCenter = typeof YCENTER

export const xSideNames = [ LEFT, RIGHT ] as const
export const ySideNames = [ TOP, BOTTOM ] as const
export const centerNames = [ XCENTER, YCENTER ] as const

export const sideNames = [ ...xSideNames, ...ySideNames ] as const

export const xPositionNames = [ LEFT, XCENTER, RIGHT ] as const
export const yPositionNames = [ TOP, YCENTER, BOTTOM ] as const

export const positionNames = [ ...xPositionNames, ...yPositionNames ] as const

export type XSide = typeof xSideNames[ number ]

export type YSide = typeof ySideNames[ number ]

export type Side = XSide | YSide

export type Center = typeof centerNames[ number ]

export type XPosition = typeof xPositionNames[ number ]

export type YPosition = typeof yPositionNames[ number ] 

export type Position = XPosition | YPosition

export type Positions = [ XPosition, YPosition ]

