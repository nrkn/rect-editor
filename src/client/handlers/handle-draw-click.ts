import { State } from '../types'
import { ClickPredicate, OnHandleClick } from '../lib/handlers/types'
import { handleAppClick } from './util/handle-app-click'
import { getAllRectIds, getAppRects } from './util'
import { rectContainsPoint } from '../lib/geometry/rect'

export const handleDrawClick = (state: State) => {
  const click: OnHandleClick = (point, _button) => {    
    const ids = getAllRectIds()

    if( ids.length === 0 ){
      // prompt for new  

      return
    }

    const appRects = getAppRects( ids ).filter( appRect => {
      return rectContainsPoint( appRect, point )
    })

    if( appRects.length > 0 ){
      const last = appRects[ appRects.length - 1 ]

      state.mode( 'select' )
      state.selector.actions.set([ last.id ])
    }
  }

  const predicate: ClickPredicate = ( _point, button ) => {
    if (state.mode() !== 'draw') return false
    if (button !== 0) return false

    return true
  }

  handleAppClick( 'draw', state, click, predicate )
}
