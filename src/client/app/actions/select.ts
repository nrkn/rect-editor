import { strictSelect } from '../../lib/dom/util'
import { getDrawRects, svgRectToRect } from '../dom/rects'
import { createResizer } from '../dom/resizer'
import { AppState } from '../types'

export const selectNone = (state: AppState) => {
  const rectEls = getDrawRects(state)

  rectEls.forEach(rectEl => rectEl.classList.remove('selected'))

  const resizeEls = state.dom.groupEl.querySelectorAll( '.resizer' )

  resizeEls.forEach( el => el.remove() )
}

export const selectAll = ( state: AppState ) => {
  selectNone( state )

  const rectEls = getDrawRects(state)

  rectEls.forEach(rectEl => selectRect( state, rectEl ) )
}

export const deselectRect = ( state: AppState, rectEl: SVGRectElement ) => {
  rectEl.classList.remove( 'selected' )

  const { id } = rectEl

  const resizerEl = strictSelect(
    `.resizer[data-id=${ id }]`, state.dom.groupEl
  )

  resizerEl.remove()
}

export const selectRect = ( state: AppState, rectEl: SVGRectElement ) => {
  rectEl.classList.add( 'selected' )

  const rect = svgRectToRect( rectEl )

  const resizeEl = createResizer( rect, rectEl.id )

  state.dom.groupEl.append( resizeEl )
}

export const toggleRect = ( state: AppState, rectEl: SVGRectElement ) => {
  if( rectEl.classList.contains( 'selected' ) ){
    deselectRect( state, rectEl )
  } else {
    selectRect( state, rectEl )
  }
}

export const isSelected = ( rectEl: SVGRectElement ) =>
  rectEl.classList.contains( 'selected' )

export const getSelection = ( state: AppState ) => {
  const rectEls = getDrawRects( state )

  return rectEls.filter( el => el.classList.contains( 'selected' ) )
}
