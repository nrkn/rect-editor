import { fieldset, legend } from '../lib/dom/h'
import { strictSelect } from '../lib/dom/util'
import { Point } from '../lib/geometry/types'
import { createInfoLabel } from './util'

export const createDeltaEl = () => {
  const fieldsetEl = fieldset(
    { id: 'delta' },
    legend( 'Delta' ),
    createInfoLabel( 'dx' ),
    createInfoLabel( 'dy' )
  )
  
  return fieldsetEl
}

export const updateDeltaEl = ( p?: Point ) => {  
  const dxEl = strictSelect<HTMLInputElement>( '#dx' )
  const dyEl = strictSelect<HTMLInputElement>( '#dy' )

  if( p === undefined ){
    dxEl.value = ''
    dyEl.value = ''

    return
  }

  const { x, y } = p

  dxEl.value = Math.floor( x ).toString()
  dyEl.value = Math.floor( y ).toString()
}
