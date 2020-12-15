import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { createHandler } from '../lib/handlers/create-handler'


export const handleRectCollectionUndo = (state: State) => {
  const buttonEl = strictSelect<HTMLButtonElement>('#undo')

  const click = (e: MouseEvent) => {
    e.preventDefault()

    state.rects.undo()
  }

  const enabler = () => {
    buttonEl.addEventListener('click', click)
  }

  const disabler = () => {
    buttonEl.removeEventListener('click', click)
  }

  return createHandler('undo-click', enabler, disabler)
}
