import { strictSelect } from '../lib/dom/util'
import { State } from '../types'

export const handleLayers = (state: State ) => {
  const { get: getSelection, set: setSelection } = state.selector.actions

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

    console.log( 'layer fieldset changed' )
    setSelection( ids )
  })

  const addClickEvent = (
    el: HTMLButtonElement, action: (ids: string[]) => void
  ) => {
    el.addEventListener('click', e => {
      e.preventDefault()

      const ids = getSelection()

      action( ids )
    })
  }

  // the list is stored with topmost last
  addClickEvent( toFrontEl, state.rects.toEnd )
  addClickEvent( forwardEl, state.rects.forward )
  addClickEvent( backwardEl, state.rects.back )
  addClickEvent( toBackEl, state.rects.toStart ) 
}
