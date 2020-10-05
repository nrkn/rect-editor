import { strictFormElement, strictSelect } from '../lib/dom/util'
import { redoAction, undoAction } from './actions'
import { zoomToFit } from './geometry'
import { isAppMode } from './predicates'
import { getDrawRects } from './rects'
import { AppMode, AppState } from './types'

export const initForm = (state: AppState) => {
  const { options } = state
  const { formEl } = state.dom

  const modeEl = strictFormElement(formEl, 'mode')
  const cellWidthEl = strictFormElement(formEl, 'cellWidth')
  const cellHeightEl = strictFormElement(formEl, 'cellHeight')

  formEl.addEventListener('change', () => {
    const newMode = modeEl.value

    if (isAppMode(newMode)) {
      state.mode = newMode
    } else {
      throw Error(`Unexpected mode ${newMode}`)
    }

    const cellWidth = parseInt(cellWidthEl.value)
    const cellHeight = parseInt(cellHeightEl.value)

    if (!isNaN(cellWidth) && cellWidth >= 1) {
      options.snap.width = cellWidth
    }

    if (!isNaN(cellHeight) && cellHeight >= 1) {
      options.snap.height = cellHeight
    }
  })

  const resetZoomButtonEl = strictSelect<HTMLButtonElement>(
    '#resetZoom', formEl
  )

  resetZoomButtonEl.addEventListener('click', () => zoomToFit(state))

  const undoButtonEl = strictSelect<HTMLButtonElement>(
    '#undo', formEl
  )

  undoButtonEl.addEventListener('click', () => undoAction( state ) )

  const redoButtonEl = strictSelect<HTMLButtonElement>(
    '#redo', formEl
  )

  redoButtonEl.addEventListener( 'click', () => redoAction( state ) )

  modeEl.value = 'pan'
  cellWidthEl.value = String(options.snap.width)
  cellHeightEl.value = String(options.snap.height)
}
