import { fitAndPosition } from 'object-fit-math'
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

export const zoomToFit = (state: AppState) => {
  const { viewportEl } = state.dom
  const { gridSize } = state.options

  const parentSize = viewportEl.getBoundingClientRect()

  const { x: fx, y: fy, width: fw } = fitAndPosition(
    parentSize, gridSize, 'contain', '50%', '50%'
  )

  const scale = fw / gridSize.width
  const x = fx / scale
  const y = fy / scale

  Object.assign(state.transform, { x, y, scale })

  applyTransform(state)
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

export const svgRectToRect = ( el: SVGRectElement ) => {
  const { x: ex, y: ey, width: ew, height: eh } = el

  const x = ex.baseVal.value
  const y = ey.baseVal.value
  const width = ew.baseVal.value
  const height = eh.baseVal.value

  const rect: Rect = { x, y, width, height }

  return rect
}