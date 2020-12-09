import { handleSize } from '../consts'
import { updateInfoSelection } from '../els/info-selection'
import { updateResizer, createResizer } from '../els/resizer'
import { strictSelect, getRectElRect } from '../lib/dom/util'
import { getBoundingRect } from '../lib/geometry/rect'
import { State } from '../types'

export const handleSelectionChanged = (state: State) => {
  const bodyEl = strictSelect<SVGGElement>('#body')
  const rectsEl = strictSelect<SVGGElement>('#rects')

  const handler = (ids: string[]) => {
    state.dirty = true

    const existing = document.querySelector<SVGGElement>('#resizer')

    if (ids.length === 0) {
      existing?.remove()
      updateInfoSelection()

      return
    }

    const rectEls = ids.map(
      id => strictSelect<SVGRectElement>(`#${id}`, rectsEl)
    )

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

  state.selector.on( handler )
}
