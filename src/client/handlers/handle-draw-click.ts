import { Actions, State } from '../types'
import { handleClick } from './handle-click'
import { createTranslatePoint } from './util'

export const handleDrawClick = ( state: State, _actions: Actions ) => {
  handleClick( createTranslatePoint( state ), ( button, _point ) => {
    if( state.mode() !== 'draw' ) return
    if( button !== 0 ) return

    // prompt for new
  })
}
