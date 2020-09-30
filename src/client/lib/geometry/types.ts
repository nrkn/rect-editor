export type Point = { x: number, y: number }

export type Transform = Point & { scale: number }

export type Size = { width: number, height: number }

export type Rect = Point & Size

export type Line = {
  x1: number
  y1: number
  x2: number
  y2: number
}
