import { fieldset, legend } from '../lib/dom/h'
import { createInfoLabel } from './util'

export const createPositionEl = () => {
  const fieldsetEl = fieldset(
    { id: 'position' },
    legend( 'Position' ),
    createInfoLabel( 'x', 'positionX' ),
    createInfoLabel( 'y', 'positionY' )
  )
  
  return fieldsetEl
}
