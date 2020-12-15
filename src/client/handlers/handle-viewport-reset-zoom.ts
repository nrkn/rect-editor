import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { createHandler } from '../lib/handlers/create-handler'

export const handleViewportResetZoom = (state: State) => {
  const buttonEl = strictSelect<HTMLButtonElement>('#reset-zoom')

  const click = (e: MouseEvent) => {
    e.preventDefault()

    state.zoomToFit()
  }

  const enabler = () => {
    buttonEl.addEventListener('click', click)
  }

  const disabler = () => {
    buttonEl.removeEventListener('click', click)
  }

  return createHandler('reset-zoom-click', enabler, disabler)
}
