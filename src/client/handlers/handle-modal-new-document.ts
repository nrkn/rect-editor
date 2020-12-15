import { createModalNewDocument, getModalNewDocumentValue } from '../els/modal-new'
import { DocumentData } from '../types'
import { handleModal } from './util/handle-modal'

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
