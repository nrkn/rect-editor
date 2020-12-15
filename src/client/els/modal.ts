import { button, div, fieldset, form, input, label, legend } from '../lib/dom/h'
import { isElement } from '../lib/dom/predicates'
import { strictSelect } from '../lib/dom/util'

export const createModal = () => {
  const modalEl = div(
    { id: 'modal' },
    div(
      { id: 'modal-contents' },
      button({ id: 'close-modal', type: 'button' }, 'Close' )      
    )
  )

  return modalEl
}

export const isModal = () => {
  const modalEl = strictSelect<HTMLElement>( '#modal' )

  return modalEl.style.display === 'flex'
}

export const hideModal = () => {
  const modalEl = strictSelect<HTMLElement>( '#modal' )

  modalEl.style.display = 'none'
}

export const showModal = () => {
  const modalEl = strictSelect<HTMLElement>( '#modal' )

  modalEl.style.display = 'flex'
}

export const toggleModal = ( visible?: boolean ) => {
  const modalEl = strictSelect<HTMLElement>( '#modal' )

  if( visible === undefined ){
    visible = modalEl.style.display === 'none'
  }
  
  modalEl.style.display = visible ? 'flex' : 'none'
}

export const updateModal = ( ...contents: ( Node | string )[] ) => {
  const contentsEl = strictSelect<HTMLElement>( '#modal-contents' )

  contentsEl.childNodes.forEach( node => {
    if( isElement( node ) ){
      if( node.id === 'close-modal' ) return
    }

    node.remove()
  })

  contentsEl.append( ...contents )
}
