import { rectContainsPoint } from '../lib/geometry/rect'
import { Point } from '../lib/geometry/types'
import { svgRectToRect } from './geometry'
import { AppState } from './types'

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
