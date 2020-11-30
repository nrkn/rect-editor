import { rectContainsPoint } from '../lib/geometry/rect'
import { Actions, State } from '../types'
import { handleClick } from './handle-click'
import { createTranslatePoint, getAllRects, svgRectToRect } from './util'

export const handleSelectClick = ( state: State, actions: Actions ) => {
  handleClick( createTranslatePoint( state ), ( button, point ) => {
    if( state.mode() !== 'select' ) return
    if( button !== 0 ) return

    const rectEls = getAllRects()

    const clickedRects = rectEls.filter( el => {
      const rect = svgRectToRect( el )

      return rectContainsPoint( rect, point )
    })

    if( clickedRects.length === 0 ){
      actions.selection.clear()
      
      return
    }

    const last = clickedRects[ clickedRects.length - 1 ]

    const { id } = last

    if( state.keys.Shift ){
      actions.selection.toggle([ id ])
    } else {
      actions.selection.set([ id ])
    }
  })
}
