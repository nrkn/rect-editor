import { rect } from '../../lib/dom/s'
import { rectContainsPoint } from '../../lib/geometry/rect'
import { Point, Rect } from '../../lib/geometry/types'
import { randomId } from '../../lib/util'
import { AppState } from '../types'

export const setRectElRect = ( 
  rectEl: SVGRectElement,
  newRect: Partial<Rect> = {}
) => {
  const initialRect = svgRectToRect( rectEl )

  const { x, y, width, height } = Object.assign(
    {}, initialRect, newRect
  )

  rectEl.x.baseVal.value = x
  rectEl.y.baseVal.value = y
  rectEl.width.baseVal.value = width
  rectEl.height.baseVal.value = height
}

export const createRectEl = (
  id = randomId(), 
  { x = 0, y = 0, width = 1, height = 1 }: Partial<Rect> = {}
) => {
  const rectEl = rect({
    id,
    class: 'draw-rect',
    fill: 'rgba( 255, 255, 255, 0.75 )'
  })

  setRectElRect( rectEl, { x, y, width, height } )

  return rectEl
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

export const getDrawRects = ( state: AppState ) => {
  const { groupEl } = state.dom

  const rects = groupEl.querySelectorAll<SVGRectElement>( '.draw-rect' )

  return [ ...rects ]
}

export const findRectAt = ( state: AppState, point: Point ) => {
  const rectEls = getDrawRects( state )

  for( let i = rectEls.length - 1; i >= 0; i-- ){
    const rectEl = rectEls[ i ]
    const rect = svgRectToRect( rectEl )

    if( rectContainsPoint( rect, point ) ) return rectEl
  }
}
