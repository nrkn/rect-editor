import { updateLayers } from '../els/layers'
import { createAppRectEl, updateAppRectEl } from '../els/rect'
import { Collection } from '../lib/collection/types'
import { attr, strictSelect } from '../lib/dom/util'
import { Actions, AppRect, State } from '../types'

export const rectHandlers = (
  collection: Collection<AppRect>,
  state: State,
  actions: Actions
) => {
  const rectsEl = strictSelect<SVGGElement>('#rects')

  collection.on.add(
    rects => {
      rectsEl.append(...rects.map(createAppRectEl))

      updateLayers(state,actions)
    }
  )

  collection.on.remove(
    ids => {
      ids.forEach(
        id => {
          const el = strictSelect(`#${id}`)

          el.remove()
        }
      )

      updateLayers(state,actions)
    }
  )

  collection.on.update(
    rects => {
      rects.forEach(
        rect => updateAppRectEl(rect)
      )

      updateLayers(state,actions)
    }
  )

  collection.on.setOrder(
    ids => {
      ids.forEach(
        id => {
          const el = strictSelect(`#${id}`)

          rectsEl.append(el)
        }
      )

      updateLayers(state,actions)
    }
  )

  collection.on.undo(() => actions.selection.clear())
  collection.on.redo(() => actions.selection.clear())
}
