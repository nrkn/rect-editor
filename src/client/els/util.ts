import { label, input } from '../lib/dom/h'

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
