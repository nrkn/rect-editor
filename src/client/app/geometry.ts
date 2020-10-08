import { attr } from '../lib/dom/util'
import { transformToSvg } from '../lib/dom/geometry'
import { Point, Rect, Transform } from '../lib/geometry/types'
import { AppState } from './types'

export const localToGrid = (
  x: number, y: number, 
  transform: Transform, 
  viewBoxOffset: Point
): Point => {  
  const { x: tx, y: ty, scale } = transform
  const { x: vx, y: vy } = viewBoxOffset

  x += vx
  y += vy 
  
  x -= tx 
  y -= ty

  x /= scale
  y /= scale

  return { x, y }
}

export const getLocalCenter = (state: AppState): Point => {
  const { viewportEl } = state.dom
  const { width, height } = viewportEl.getBoundingClientRect()

  const x = width / 2
  const y = height / 2

  return { x, y }
}

export const ensureMinScale = ( state: AppState ) => {
  const { transform, options } = state
  const { minScale } = options
  
  if( transform.scale < minScale ) transform.scale = minScale
}

export const applyTransform = (state: AppState) => {
  const { transform } = state
  const { groupEl } = state.dom
  
  ensureMinScale( state )

  attr(groupEl, { transform: transformToSvg(transform) })
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
