import { clone } from '../util'
import { deltaPoint, scalePoint, translatePoint } from './point'
import { Point, Positions, Rect, SidesRect, Size, StringRect } from './types'

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

export const scaleRect = (
  { x, y, width, height }: Rect, { x: sx, y: sy }: Point
) => {
  x *= sx
  y *= sy
  width *= sx
  height *= sy

  const scaled: Rect = { x, y, width, height }

  return scaled
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

export const rectToStringRectFixed = (
  { x, y, width, height }: Rect, fractionDigits = 1
): StringRect => (
  {
    x: x.toFixed(fractionDigits),
    y: y.toFixed(fractionDigits),
    width: width.toFixed(fractionDigits),
    height: height.toFixed(fractionDigits)
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

export const growRect = (rect: Rect, ...args: number[]) => {
  let { x, y, width, height } = rect

  if (args.length === 0) return { x, y, width, height }

  if (args.length === 1) {
    x -= args[0]
    y -= args[0]
    width += args[0] * 2
    height += args[0] * 2

    return { x, y, width, height }
  }

  if (args.length === 2) {
    x -= args[1]
    y -= args[0]
    width += args[1] * 2
    height += args[0] * 2

    return { x, y, width, height }
  }

  if (args.length === 3) {
    x -= args[1]
    y -= args[0]
    width += args[1] * 2
    height += args[0] + args[2]

    return { x, y, width, height }
  }

  x -= args[3]
  y -= args[0]
  width += args[3] + args[1]
  height += args[0] + args[2]

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
  { top, right, bottom, left }: SidesRect
): Rect => {
  const x = left
  const y = top
  const width = right - left
  const height = bottom - top

  return { x, y, width, height }
}

export const translateRect = (rect: Rect, delta: Point) => {
  const p = translatePoint(rect, delta)

  return Object.assign({}, rect, p)
}

export const growSidesRectByDelta = (
  sidesRect: SidesRect, delta: Point, origin: Positions
) => {
  const [oX, oY] = origin

  let { top, right, bottom, left } = sidesRect

  if (oY === 'top') top += delta.y
  if (oX === 'right') right += delta.x
  if (oY === 'bottom') bottom += delta.y
  if (oX === 'left') left += delta.x

  const grownRect: SidesRect = { top, right, bottom, left }

  return grownRect
}

export const scaleSidesRect = (
  sidesRect: SidesRect, scale: Point
) => {
  let { top, right, bottom, left } = sidesRect

  top *= scale.y
  right *= scale.x
  bottom *= scale.y
  left *= scale.x

  const scaledRect: SidesRect = { top, right, bottom, left }

  return scaledRect
}

// make a page with a red cross, two guides in cx,cy
// make a group of two rects, and get bounds
// center the group on cx,cy
// have a form that lets you change the origin and delta to preview
export const scaleRectFrom = <T extends Rect>(
  bounds: Rect,
  appRect: T,
  delta: Point,
  origin: Positions,
  maintainAspect = false
) => {
  // rect = Object.assign(
  //   {},
  //   rect,
  //   translateRect(rect, { x: -bounds.x, y: -bounds.y })
  // )

  // const newBoundsRect = sidesRectToRect(
  //   growSidesRectByDelta(
  //     rectToSidesRect(bounds), delta, origin
  //   )
  // )

  // const scaleX = newBoundsRect.width / bounds.width
  // const scaleY = newBoundsRect.height / bounds.height

  // const scaled = scaleSidesRect(
  //   rectToSidesRect(rect), { x: scaleX, y: scaleY }
  // )

  // Object.assign(
  //   rect, translateRect(sidesRectToRect(scaled), bounds)
  // )

  // return rect

  const sidesRect = rectToSidesRect(bounds)

  let grown = growSidesRectByDelta(sidesRect, delta, origin)

  if (maintainAspect) {
    const [originX, originY] = origin

    if (originX === 'xCenter' && delta.x !== 0) {
      const halfDeltaX = delta.x / 2

      grown.left -= halfDeltaX
      grown.right += halfDeltaX
    }

    if (originY === 'yCenter' && delta.y !== 0) {
      const halfDeltaY = delta.y / 2

      grown.top -= halfDeltaY
      grown.bottom += halfDeltaY
    }
  }

  const newBoundsRect = sidesRectToRect(grown)

  let flipX = false
  let flipY = false

  if (newBoundsRect.width < 0) {
    flipX = true
    newBoundsRect.x += newBoundsRect.width * 2
    newBoundsRect.width *= -1
  }

  if (newBoundsRect.height < 0) {
    flipY = true
    newBoundsRect.y += newBoundsRect.height * 2
    newBoundsRect.height *= -1
  }

  if (newBoundsRect.width === 0 || newBoundsRect.height === 0) return

  appRect = scaleRectFromBounds(appRect, bounds, newBoundsRect)
  appRect = flipRectInBounds(appRect, newBoundsRect, flipX, flipY)

  return appRect
}

export const scaleRectFromBounds = <T extends Rect>(
  rect: T,
  fromBounds: Rect,
  toBounds: Rect
) => {
  rect = clone(rect)

  const x = toBounds.width / fromBounds.width
  const y = toBounds.height / fromBounds.height
  const scale = { x, y }

  const negativeTranslate = scalePoint(fromBounds, -1)
  const delta = deltaPoint(toBounds, fromBounds)

  Object.assign(rect, translateRect(rect, negativeTranslate))
  Object.assign(rect, scaleRect(rect, scale))
  Object.assign(rect, translateRect(rect, fromBounds))
  Object.assign(rect, translateRect(rect, delta))

  return rect
}

export const flipRectInBounds = <T extends Rect>(
  rect: T, bounds: Rect, flipX: boolean, flipY: boolean
) => {
  rect = clone(rect)

  const negativeTranslate = scalePoint(bounds, -1)

  Object.assign(rect, translateRect(rect, negativeTranslate))

  let { x, y, width, height } = rect

  if (flipX) {
    x = bounds.width - x - width
  }

  if (flipY) {
    y = bounds.height - y - height
  }

  Object.assign(rect, { x, y, width, height })

  Object.assign(rect, translateRect(rect, bounds))

  return rect
}
