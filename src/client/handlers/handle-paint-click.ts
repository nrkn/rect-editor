import { State } from '../types'
import { ClickPredicate, OnHandleClick } from '../lib/handlers/types'
import { handleAppClick } from './helpers/handle-app-click'
import { getAllRectIds, getAppRects } from './util'
import { rectContainsPoint } from '../lib/geometry/rect'
import { updateAppRectEl } from '../views/rect'

export const handlePaintClick = (state: State) => {  
  const click: OnHandleClick = (point, _button) => {    
    const ids = getAllRectIds()

    if( ids.length === 0 ){
      return
    }

    const appRects = getAppRects( ids ).filter( appRect => {
      return rectContainsPoint( appRect, point )
    })

    if( appRects.length > 0 ){
      const last = appRects[ appRects.length - 1 ]

      last['data-style'] = state.currentStyleId()

      updateAppRectEl( state.styles, last )
    }
  }

  const predicate: ClickPredicate = ( _point, button ) => {
    if (state.mode() !== 'paint') return false
    if (button !== 0) return false

    return true
  }

  return handleAppClick( 'paint-click', state, click, predicate )
}
