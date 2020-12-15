import { form, fieldset, legend, label, input } from '../../lib/dom/h'
import { strictFormElement, strictSelect } from '../../lib/dom/util'
import { DocumentData } from '../../types'

export const createModalNewDocument = () => {
  const modalNewEl = form(
    { id: 'modalNew' },
    fieldset(
      legend('Document Size'),
      label(
        'Width',
        input(
          { id: 'modalNewWidth', type: 'number', min: 1, step: 1, value: 1000 }
        )
      ),
      label(
        'Height',
        input(
          { id: 'modalNewHeight', type: 'number', min: 1, step: 1, value: 1000 }
        )
      )
    ),
    input({ type: 'submit', value: 'Create New Document' })
  )

  return modalNewEl
}

export const getModalNewDocumentValue = () => {
  const modalNewEl = strictSelect<HTMLFormElement>( '#modalNew' )

  const widthEl = strictFormElement(
    modalNewEl, 'modalNewWidth'
  ) as HTMLInputElement

  const heightEl = strictFormElement(
    modalNewEl, 'modalNewHeight'
  ) as HTMLInputElement

  const width = widthEl.valueAsNumber
  const height = heightEl.valueAsNumber

  const newDocumentValue: Partial<DocumentData> = {
    documentSize: { width, height }
  }

  return newDocumentValue
}