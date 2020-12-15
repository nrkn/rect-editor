import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { createHandler } from '../lib/handlers/create-handler'


export const handleRectCollectionRedo = (state: State) => {
  const buttonEl = strictSelect<HTMLButtonElement>('#redo')

  const click = (e: MouseEvent) => {
    e.preventDefault()

    state.rects.redo()
  }

  const enabler = () => {
    buttonEl.addEventListener('click', click)
  }

  const disabler = () => {
    buttonEl.removeEventListener('click', click)
  }

  return createHandler('redo-click', enabler, disabler)
}
