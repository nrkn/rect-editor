import { strictSelect } from '../lib/dom/util'
import { Actions, State } from '../types'

export const handleLayers = (state: State, actions: Actions) => {
  const fieldsetEl = strictSelect<HTMLFieldSetElement>('#layers fieldset')

  const toFrontEl = strictSelect<HTMLButtonElement>('#toFront', fieldsetEl)
  const forwardEl = strictSelect<HTMLButtonElement>('#forward', fieldsetEl)
  const backwardEl = strictSelect<HTMLButtonElement>('#backward', fieldsetEl)
  const toBackEl = strictSelect<HTMLButtonElement>('#toBack', fieldsetEl)

  fieldsetEl.addEventListener('change', () => {
    state.mode('select')

    const inputEls = fieldsetEl.querySelectorAll<HTMLInputElement>(
      'input[name="selectedLayers"]'
    )

    const ids = [...inputEls].filter(el => el.checked).map(
      el => el.value
    )

    actions.selection.set(ids)
  })

  const addClickEvent = (
    el: HTMLButtonElement, action: (ids: string[]) => void
  ) => {
    el.addEventListener('click', e => {
      e.preventDefault()

      const ids = actions.selection.get()

      action( ids )
    })
  }

  // the list is stored with topmost last
  addClickEvent( toFrontEl, actions.rects.toEnd )
  addClickEvent( forwardEl, actions.rects.forward )
  addClickEvent( backwardEl, actions.rects.back )
  addClickEvent( toBackEl, actions.rects.toStart ) 
}
