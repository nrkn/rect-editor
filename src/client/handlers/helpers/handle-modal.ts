import { updateModal, showModal, hideModal } from '../../els/modal'
import { strictSelect } from '../../lib/dom/util'
import { createHandler } from '../../lib/handlers/create-handler'

export const handleModal = <T>(
  name: string,
  contents: HTMLElement,
  getValue: () => T,
  onSubmit: (value: T) => void,
  isClosable = true
) => {
  const modalEl = strictSelect<HTMLElement>('#modal')
  const closeButtonEl = strictSelect<HTMLButtonElement>('#close-modal')

  const submit = (e: Event) => {
    e.preventDefault()

    const value = getValue()

    close()

    onSubmit(value)
  }

  const enablers = () => {
    updateModal(contents)
    showModal()

    contents.addEventListener('submit', submit)
    
    if( isClosable ){
      document.addEventListener('keydown', esc)
      document.addEventListener('click', closeOnClick)
      closeButtonEl.addEventListener('click', close)  
    }
  }

  const disablers = () => {
    contents.removeEventListener('submit', submit)

    if( isClosable ){
      document.removeEventListener('keydown', esc)
      document.removeEventListener('click', closeOnClick)
      closeButtonEl.removeEventListener('click', close) 
    }

    contents.remove()

    hideModal()    
  }

  const close = () => {
    disablers()
  }

  const esc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }

  const closeOnClick = (e: MouseEvent) => {
    if (e.target === modalEl) {
      close()
    }
  }

  return createHandler( name, enablers, disablers )
}