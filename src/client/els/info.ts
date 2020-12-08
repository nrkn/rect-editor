import { div } from '../lib/dom/h'
import { createDeltaEl } from './info-delta'
import { createPositionEl } from './info-position'
import { createInfoSelectionEl } from './info-selection'

export const createInfo = () => {
  const infoEl = div( 
    { id: 'info' },
    createPositionEl(),
    createDeltaEl(),
    createInfoSelectionEl()    
  )

  return infoEl
}
