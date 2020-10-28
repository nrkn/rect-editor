import { fitAndPosition } from 'object-fit-math'
import { transformToSvg } from './lib/dom/geometry'
import { attr } from './lib/dom/util'
import { transformRelativeTo } from './lib/geometry/transform'
import { Point, Rect, Size, Transform } from './lib/geometry/types'

export const getLocalCenter = (element: Element): Point => {
  const { width, height } = element.getBoundingClientRect()

  const x = width / 2
  const y = height / 2

  return { x, y }
}

export const ensureMinScale = ( transform: Transform, minScale: number ) => {
  if( transform.scale < minScale ) transform.scale = minScale
}

export const applyTransform = (
  element: SVGElement, transform: Transform, minScale: number
) => { 
  ensureMinScale( transform, minScale )

  attr(element, { transform: transformToSvg(transform) })
}

export const insideRect = ( 
  { x, y, width, height }: Rect, strokeWidth = 1 
): Rect => {
  x += strokeWidth / 2
  y += strokeWidth / 2
  width -= strokeWidth
  height -= strokeWidth

  return { x, y, width, height }
}

export const zoomToFit = ( parent: Size, child: Size ) => {
  const { x: fx, y: fy, width: fw } = fitAndPosition(
    parent, child, 'contain', '50%', '50%'
  )

  const scale = fw / child.width
  const x = fx / scale
  const y = fy / scale

  const transform: Transform = { x, y, scale }

  return transform
}

export const zoomAt = ( transform: Transform, { scale, x, y }: Transform, minScale: number ) => {
  if( scale < minScale ) scale = minScale
  
  const newTransform = transformRelativeTo(
    transform, scale, { x, y }
  )

  return Object.assign( {}, transform, newTransform)
}

export const getBoundingRect = ( rects: Rect[] ): Rect | undefined => {
  if( rects.length === 0 ) return

  const [ first, ...rest ] = rects

  let { x: left, y: top } = first
  let right = left + first.width
  let bottom = top + first.height

  rest.forEach( rect => {
    const { x: rx, y: ry, width: rw, height: rh } = rect
    const rr = rx + rw
    const rb = ry + rh

    if( rx < left ) left = rx
    if( ry < top ) top = ry
    if( rr > right ) right = rr
    if( rb > bottom ) bottom = rb
  })

  const x = left
  const y = top
  const width = right - left
  const height = bottom - top

  return { x, y, width, height }
}
