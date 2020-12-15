import { rectContainsPoint } from '../lib/geometry/rect'
import { State } from '../types'
import { selectActions } from '../state/select-actions'
import { getAllRects, svgRectToRect } from './util'
import { handleAppClick } from './helpers/handle-app-click'
import { ClickPredicate, OnHandleClick } from '../lib/handlers/types'

export const handleSelectClick = (state: State) => {
  const {
    clearSelection, toggleSelected, setSelected
  } = selectActions(state)

  const click: OnHandleClick = point => {
    const rectEls = getAllRects()

    const clickedRects = rectEls.filter(el => {
      const rect = svgRectToRect(el)

      return rectContainsPoint(rect, point)
    })

    if (clickedRects.length === 0) {
      clearSelection()

      return
    }

    const last = clickedRects[clickedRects.length - 1]

    const { id } = last

    if (state.keys.Shift) {
      toggleSelected([id])
    } else {
      setSelected([id])
    }
  }

  const predicate: ClickPredicate = ( _point, button ) => {
    if (state.mode() !== 'select') return false
    if (button !== 0) return false
    
    return true
  }

  return handleAppClick( 'select-click', state, click, predicate )
}
