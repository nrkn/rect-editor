import { createModalNewDocument, getModalNewDocumentValue } from '../views/modals/modal-new-document'
import { DocumentData } from '../types'
import { handleModal } from './helpers/handle-modal'

export const handleModalNewDocument = (
  newApp: (options?: Partial<DocumentData>) => void
) => {
  const modalNewEl = createModalNewDocument()
  
  return handleModal(
    'modal-new-document',
    modalNewEl,
    getModalNewDocumentValue,
    newApp
  )
}
