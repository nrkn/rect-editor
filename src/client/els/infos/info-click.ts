import { fieldset, legend } from '../../lib/dom/h'
import { strictSelect } from '../../lib/dom/util'
import { Point } from '../../lib/geometry/types'
import { createInfoNumLabel } from '../util'

export const createClickEl = () => {
  const fieldsetEl = fieldset(
    { id: 'click' },
    legend( 'Last Click' ),  
    createInfoNumLabel( 'x', 'clickX' ),
    createInfoNumLabel( 'y', 'clickY' )
  )
  
  return fieldsetEl
}

export const updateClickEl = ( p?: Point, name?: string ) => {  
  const fieldsetEl = strictSelect<HTMLFieldSetElement>( '#click' )
  const legendEl = strictSelect( 'legend', fieldsetEl )
  
  const xEl = strictSelect<HTMLInputElement>( '#clickX' )
  const yEl = strictSelect<HTMLInputElement>( '#clickY' )

  const nameLabel = name ? `: ${ name }` : ''
  
  legendEl.innerHTML = `Last Click${ nameLabel }`

  xEl.value = p?.x ? Math.floor( p.x ).toString() : ''
  yEl.value = p?.y ? Math.floor( p.y ).toString()  : ''
}
