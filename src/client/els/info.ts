import { div } from '../lib/dom/h'
import { createClickEl } from './info-click'
import { createDeltaEl } from './info-delta'
import { createPositionEl } from './info-position'
import { createInfoSelectionEl } from './info-selection'

export const createInfo = () => {
  const infoEl = div( 
    { id: 'info' },
    createPositionEl(),
    createClickEl(),
    createDeltaEl(),
    createInfoSelectionEl()    
  )

  return infoEl
}
