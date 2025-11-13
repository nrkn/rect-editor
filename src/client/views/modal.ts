import { button, div } from '../lib/dom/h'
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

export const hideModal = () => {
  const modalEl = strictSelect<HTMLElement>( '#modal' )

  modalEl.style.display = 'none'
}

export const showModal = () => {
  const modalEl = strictSelect<HTMLElement>( '#modal' )

  modalEl.style.display = 'flex'
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
