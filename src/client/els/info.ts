import { div } from '../lib/dom/h'
import { createPositionEl } from './info-position'
import { createInfoSelectionEl } from './info-selection'

export const createInfo = () => {
  const infoEl = div( 
    { id: 'info' },
    createPositionEl(),
    createInfoSelectionEl()
  )

  return infoEl
}
