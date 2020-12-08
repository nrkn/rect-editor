import { label, input } from '../lib/dom/h'
import { strictFieldsetRadioNodes, strictFormRadioNodes, strictSelect } from '../lib/dom/util'

export const createInfoLabel = (
  caption: string, id = caption
) =>
  label(
    `${caption} `,
    input(
      {
        id,
        readonly: 'readonly'
      }
    )
  )

export const getCurrentStyle = () => {
  const toolsEl = strictSelect<HTMLFormElement>( '#tools > form' )

  const styleRadios = strictFormRadioNodes( toolsEl, 'fill' )

  return styleRadios.value
}