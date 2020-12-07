import { rect } from '../dom/s'
import { clone } from '../dom/util'
import { Point, Positions, Rect, SidesRect, StringRect } from './types'

export const rectContainsPoint = (
  rect: Rect, point: Point
) => {
  if (point.x < rect.x) return false
  if (point.y < rect.y) return false
  if (point.x > (rect.x + rect.width)) return false
  if (point.y > (rect.y + rect.height)) return false

  return true
}

export const insideRect = (
  { x, y, width, height }: Rect, offset = 1
): Rect => {
  x += offset / 2
  y += offset / 2
  width -= offset
  height -= offset

  return { x, y, width, height }
}

export const getBoundingRect = (rects: Rect[]): Rect | undefined => {
  if (rects.length === 0) return

  const [first, ...rest] = rects

  let { x: left, y: top } = first
  let right = left + first.width
  let bottom = top + first.height

  rest.forEach(rect => {
    const { x: rx, y: ry, width: rw, height: rh } = rect
    const rr = rx + rw
    const rb = ry + rh

    if (rx < left) left = rx
    if (ry < top) top = ry
    if (rr > right) right = rr
    if (rb > bottom) bottom = rb
  })

  const x = left
  const y = top
  const width = right - left
  const height = bottom - top

  return { x, y, width, height }
}


export const rectIntersection = (a: Rect, b: Rect): Rect | undefined => {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const right = Math.min(a.x + a.width, b.x + b.width)
  const bottom = Math.min(a.y + a.height, b.y + b.height)

  if (right >= x && bottom >= y) {
    const width = right - x
    const height = bottom - y

    return { x, y, width, height }
  }
}

export const rectToStringRect = (
  { x, y, width, height }: Rect
): StringRect => (
  {
    x: String(x),
    y: String(y),
    width: String(width),
    height: String(height)
  }
)

export const stringRectToRect = (
  { x, y, width, height }: StringRect
): Rect => (
  {
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height)
  }
)

export const growRect = ( rect: Rect, ...args: number[] ) => {
  let { x, y, width, height } = rect
 
  if( args.length === 0 ) return { x, y, width, height }

  if( args.length === 1 ){
    x -= args[ 0 ]
    y -= args[ 0 ]
    width += args[ 0 ] * 2
    height += args[ 0 ] * 2

    return { x, y, width, height }
  }

  if( args.length === 2 ){
    x -= args[ 1 ]
    y -= args[ 0 ]
    width += args[ 1 ] * 2
    height += args[ 0 ] * 2

    return { x, y, width, height }
  }

  if( args.length === 3 ){
    x -= args[ 1 ]
    y -= args[ 0 ]
    width += args[ 1 ] * 2
    height += args[ 0 ] + args[ 2 ]

    return { x, y, width, height }
  }

  x -= args[ 3 ]
  y -= args[ 0 ]
  width += args[ 3 ] + args[ 1 ]
  height += args[ 0 ] + args[ 2 ]

  return { x, y, width, height }
}

export const rectToSidesRect = (
  { x, y, width, height }: Rect 
): SidesRect => {
  const left = x
  const top = y
  const right = x + width
  const bottom = y + height

  return { top, right, bottom, left }
}

export const sidesRectToRect = (
  { top, right, bottom, left}: SidesRect
): Rect => {
  const x = left
  const y = top
  const width = right - left
  const height = bottom - top

  return { x, y, width, height }
}
