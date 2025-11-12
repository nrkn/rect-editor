import { fieldset, legend } from '../../lib/dom/h'
import { createInfoNumLabel } from '../util'

export const createPositionEl = () => {
  const fieldsetEl = fieldset(
    { id: 'position' },
    legend( 'Cursor Position' ),
    createInfoNumLabel( 'x', 'positionX' ),
    createInfoNumLabel( 'y', 'positionY' )
  )
  
  return fieldsetEl
}
