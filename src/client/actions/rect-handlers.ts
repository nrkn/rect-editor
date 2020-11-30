import { createAppRectEl } from '../els/rect'
import { Collection } from '../lib/collection/types'
import { attr, strictSelect } from '../lib/dom/util'
import { Actions, AppRect } from '../types'

export const rectHandlers = (
  collection: Collection<AppRect>,
  actions: Actions
) => {
  const rectsEl = strictSelect<SVGGElement>('#rects')

  collection.on.add(
    rects => {
      rectsEl.append(...rects.map(createAppRectEl))
    }
  )

  collection.on.remove(
    ids =>
      ids.forEach(
        id => {
          const el = strictSelect(`#${id}`)

          el.remove()
        }
      )
  )

  collection.on.update(
    rects =>
      rects.forEach(
        rect => {
          const el = strictSelect(`#${rect.id}`)

          attr(el, rect)
        }
      )
  )

  collection.on.setOrder(
    ids =>
      ids.forEach(
        id => {
          const el = strictSelect(`#${id}`)

          rectsEl.append( el )
        }
      )
  )

  collection.on.undo( () => actions.selection.clear() )
  collection.on.redo( () => actions.selection.clear() )
}
