import { 
  LEFT, RIGHT, TOP, BOTTOM, XCENTER, YCENTER, xSideNames, ySideNames, 
  centerNames, xPositionNames, yPositionNames 
} from './consts'

export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Rect = Point & Size

export type StringRect = {
  [ key in keyof Rect ]: string
}

export type ScaleTransform = Point & {
  scale: number
}

export type Line = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type Left = typeof LEFT
export type Right = typeof RIGHT
export type Top = typeof TOP
export type Bottom = typeof BOTTOM
export type XCenter = typeof XCENTER
export type YCenter = typeof YCENTER

export type XSide = typeof xSideNames[ number ]

export type YSide = typeof ySideNames[ number ]

export type Side = XSide | YSide

export type Center = typeof centerNames[ number ]

export type XPosition = typeof xPositionNames[ number ]

export type YPosition = typeof yPositionNames[ number ] 

export type Position = XPosition | YPosition

export type Positions = [ XPosition, YPosition ]

export type SidesRect = Record<Side,number>
