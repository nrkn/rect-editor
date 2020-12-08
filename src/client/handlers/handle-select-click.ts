import { rectContainsPoint } from '../lib/geometry/rect'
import { State } from '../types'
import { handleClick } from './handle-click'
import { selectActions } from '../state/select-actions'

import { 
  createTranslatePoint, getAllRects, svgRectToRect 
} from './util'

export const handleSelectClick = ( state: State ) => {
  const { 
    clearSelection, toggleSelected, setSelected 
  } = selectActions( state )

  handleClick( createTranslatePoint( state ), ( button, point ) => {
    if( state.mode() !== 'select' ) return
    if( button !== 0 ) return

    const rectEls = getAllRects()

    const clickedRects = rectEls.filter( el => {
      const rect = svgRectToRect( el )

      return rectContainsPoint( rect, point )
    })

    if( clickedRects.length === 0 ){
      clearSelection()
      
      return
    }

    const last = clickedRects[ clickedRects.length - 1 ]

    const { id } = last

    if( state.keys.Shift ){
      toggleSelected([ id ])
    } else {
      setSelected([ id ])
    }
  })
}
