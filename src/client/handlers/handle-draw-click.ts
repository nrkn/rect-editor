import { State } from '../types'
import { ClickPredicate, OnHandleClick } from '../lib/handlers/types'
import { handleAppClick } from './util/handle-app-click'

export const handleDrawClick = (state: State) => {
  const click: OnHandleClick = (_point, _button) => {
    // prompt for new
  }

  const predicate: ClickPredicate = ( _point, button ) => {
    if (state.mode() !== 'draw') return false
    if (button !== 0) return false

    return true
  }

  handleAppClick( 'draw', state, click, predicate )
}
