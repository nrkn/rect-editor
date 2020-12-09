import { fieldset, legend } from '../lib/dom/h'
import { strictSelect } from '../lib/dom/util'
import { Point } from '../lib/geometry/types'
import { createInfoLabel } from './util'

export const createClickEl = () => {
  const fieldsetEl = fieldset(
    { id: 'click' },
    legend( 'Last Click' ),
    createInfoLabel( 'name', 'clickName' ),
    createInfoLabel( 'x', 'clickX' ),
    createInfoLabel( 'y', 'clickY' )
  )
  
  return fieldsetEl
}

export const updateClickEl = ( p?: Point, name?: string ) => {  
  const clickNameEl = strictSelect<HTMLInputElement>( '#clickName' )
  const xEl = strictSelect<HTMLInputElement>( '#clickX' )
  const yEl = strictSelect<HTMLInputElement>( '#clickY' )

  clickNameEl.value = name || ''
  xEl.value = p?.x ? Math.floor( p.x ).toString() : ''
  yEl.value = p?.y ? Math.floor( p.y ).toString()  : ''
}
