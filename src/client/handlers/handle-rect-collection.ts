import { createAppRectEl, updateAppRectEl } from '../els/rect'
import { strictSelect } from '../lib/dom/util'
import { AppRect, State } from '../types'
import { selectActions } from '../state/select-actions'
import { Listener } from '../lib/events/types'
import { createHandler } from '../lib/handlers/create-handler'
import { getRectEls } from './util'

export const handleRectCollection = (
  state: State
) => {
  const { rects } = state
  const { clearSelection } = selectActions(state)
  const rectsEl = strictSelect<SVGGElement>('#rects')

  const add: Listener<AppRect[]> = rects => {
    rects.forEach( r => {
      const el = createAppRectEl( r )

      updateAppRectEl( state.styles, r, el )

      rectsEl.append( el )
    })

    state.dirty = true
  }

  const remove: Listener<string[]> = ids => {
    ids.forEach(
      id => {
        const el = strictSelect(`#${id}`)

        el.remove()
      }
    )

    state.dirty = true
  }

  const update: Listener<AppRect[]> = rects => {
    rects.forEach(
      rect => updateAppRectEl(state.styles, rect)
    )

    state.dirty = true
  }

  const setOrder: Listener<string[]> = ids => {
    ids.forEach(
      id => {
        const el = strictSelect(`#${id}`)

        rectsEl.append(el)
      }
    )

    state.dirty = true
  }

  const enabler = () => {
    rects.on.add(add)
    rects.on.remove(remove)
    rects.on.update(update)
    rects.on.setOrder(setOrder)
    rects.on.undo(clearSelection)
    rects.on.redo(clearSelection)
  }

  const disabler = () => {
    rects.off.add(add)
    rects.off.remove(remove)
    rects.off.update(update)
    rects.off.setOrder(setOrder)
    rects.off.undo(clearSelection)
    rects.off.redo(clearSelection)
  }

  return createHandler('rects', enabler, disabler)
}
