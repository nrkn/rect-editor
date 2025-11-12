import { handleSize } from '../consts'
import { updateInfoSelection } from '../els/infos/info-selection'
import { updateResizer, createResizer } from '../els/resizer'
import { strictSelect, getRectElRect } from '../lib/dom/util'
import { getBoundingRect } from '../lib/geometry/rect'
import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'

export const handleSelectChange = (state: State) => {
  const bodyEl = strictSelect<SVGGElement>('#body')
  const rectsEl = strictSelect<SVGGElement>('#rects')

  let lastStyleId = ''

  const handler = (ids: string[]) => {
    state.dirty = true

    const existing = document.querySelector<SVGGElement>('#resizer')

    if (ids.length === 0) {
      if( lastStyleId !== '' ){
        state.currentStyleId( lastStyleId )
        lastStyleId = ''
      }

      existing?.remove()
      updateInfoSelection()

      return
    }

    const rectEls = ids.map(
      id => strictSelect<SVGRectElement>(`#${id}`, rectsEl)
    )

    const [ first ] = rectEls

    lastStyleId = state.currentStyleId()
    state.currentStyleId( first.dataset.style )

    const rectElRects = rectEls.map(getRectElRect)

    const bounds = getBoundingRect(rectElRects)

    updateInfoSelection(bounds)

    if (bounds === undefined) {
      existing?.remove()

      return
    }

    if (existing) {
      updateResizer(bounds, handleSize, existing)
    } else {
      const resizerEl = createResizer(bounds, handleSize)

      bodyEl.append(resizerEl)
    }
  }

  const enabler = () => {
    state.selector.on( handler )
  }

  const disabler = () => {
    state.selector.off( handler )
    lastStyleId = ''
  }

  return createHandler( 'selection', enabler, disabler )
}
