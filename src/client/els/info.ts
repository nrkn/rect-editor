import { div } from '../lib/dom/h'
import { createClickEl } from './infos/info-click'
import { createDeltaEl } from './infos/info-delta'
import { createPositionEl } from './infos/info-position'
import { createInfoSelectionEl } from './infos/info-selection'

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
