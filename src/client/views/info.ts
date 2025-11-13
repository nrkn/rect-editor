import { div } from '../lib/dom/h'
import { createPositionEl } from './infos/info-position'
import { createInfoSelectionEl } from './infos/info-selection'

export const createInfo = () => {
  const infoEl = div( 
    { id: 'info' },
    createPositionEl(),
    createInfoSelectionEl()    
  )

  return infoEl
}
