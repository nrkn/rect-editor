import { rectContainsPoint } from '../lib/geometry/rect'
import { State } from '../types'
import { handleClick } from './handle-click'
import { createTranslatePoint, getAllRects, svgRectToRect } from './util'

export const handleDrawClick = ( state: State ) => {
  handleClick( createTranslatePoint( state ), ( button, point ) => {
    if( state.mode() !== 'draw' ) return
    if( button !== 0 ) return

    const rectEls = getAllRects()

    const isClickInRect = rectEls.some( el => {
      const rect = svgRectToRect( el )

      return rectContainsPoint( rect, point )
    })

    if( isClickInRect ){
      state.mode( 'select' )
    }
  })
}
