import { updateLayers } from '../els/layers'
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

      updateLayers(state)
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

      updateLayers(state)
    }
  )

  rects.on.update(
    rects => {
      rects.forEach(
        rect => updateAppRectEl(rect)
      )

      updateLayers(state)
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

      updateLayers(state)
    }
  )

  rects.on.undo( clearSelection )
  rects.on.redo( clearSelection )
}
