import { createAppRectEl, updateAppRectEl } from '../els/rect'
import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { selectActions } from '../state/select-actions'

export const handleRectCollection = (
  state: State
) => {
  const { rects } = state
  const { clearSelection } = selectActions( state )
  const rectsEl = strictSelect<SVGGElement>('#rects')

  rects.on.add(
    rects => {
      rectsEl.append(...rects.map(createAppRectEl))

      state.dirty = true
    }
  )

  rects.on.remove(
    ids => {
      ids.forEach(
        id => {
          const el = strictSelect(`#${id}`)

          el.remove()
        }
      )

      state.dirty = true
    }
  )

  rects.on.update(
    rects => {
      rects.forEach(
        rect => updateAppRectEl(rect)
      )

      state.dirty = true
    }
  )

  rects.on.setOrder(
    ids => {
      ids.forEach(
        id => {
          const el = strictSelect(`#${id}`)

          rectsEl.append(el)
        }
      )

      state.dirty = true
    }
  )

  rects.on.undo( clearSelection )
  rects.on.redo( clearSelection )
}
