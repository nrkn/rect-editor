import { label, input } from '../lib/dom/h'

export const createInfoLabel = (
  caption: string, id: string
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
