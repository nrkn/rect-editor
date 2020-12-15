import { fieldset, legend } from '../../lib/dom/h'
import { strictSelect } from '../../lib/dom/util'
import { Point } from '../../lib/geometry/types'
import { createInfoLabel } from '../util'

export const createDeltaEl = () => {
  const fieldsetEl = fieldset(
    { id: 'delta' },
    legend( 'Delta' ),
    createInfoLabel( 'dx' ),
    createInfoLabel( 'dy' )
  )
  
  return fieldsetEl
}

export const updateDeltaEl = ( p?: Point, name?: string ) => {  
  const fieldsetEl = strictSelect<HTMLFieldSetElement>( '#delta' )
  const legendEl = strictSelect( 'legend', fieldsetEl )

  const dxEl = strictSelect<HTMLInputElement>( '#dx' )
  const dyEl = strictSelect<HTMLInputElement>( '#dy' )

  const nameLabel = name ? `: ${ name }` : ''

  legendEl.innerHTML = `Delta${ nameLabel }`
  
  dxEl.value = p?.x ? Math.floor( p.x ).toString() : ''
  dyEl.value = p?.y ? Math.floor( p.y ).toString()  : ''
}
