import { State } from '../types'
import { ClickPredicate, OnHandleClick } from '../lib/handlers/types'
import { handleAppClick } from './helpers/handle-app-click'
import { getAllRectIds, getAppRects } from './util'
import { rectContainsPoint } from '../lib/geometry/rect'

export const handlePickClick = (state: State) => {  
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

      
      console.log( 'picked', last['data-style'] )
    }
  }

  const predicate: ClickPredicate = ( _point, button ) => {
    if (state.mode() !== 'pick') return false
    if (button !== 0) return false

    return true
  }

  return handleAppClick( 'pick-click', state, click, predicate )
}
