import { fieldset, legend } from '../../lib/dom/h'
import { strictSelect } from '../../lib/dom/util'
import { rectToStringRect } from '../../lib/geometry/rect'
import { Rect } from '../../lib/geometry/types'
import { createInfoLabel } from '../util'

export const createInfoSelectionEl = () => {
  const fieldsetEl = fieldset(
    { id: 'selection' },
    legend( 'Selection' ),
    createInfoLabel( 'x', 'selectionX' ),
    createInfoLabel( 'y', 'selectionY' ),
    createInfoLabel( 'w', 'selectionW' ),
    createInfoLabel( 'h', 'selectionH' )
  )
  
  return fieldsetEl
}

export const updateInfoSelection = ( rect?: Rect ) => {
  const selectionXEl = strictSelect<HTMLInputElement>( '#selectionX' )
  const selectionYEl = strictSelect<HTMLInputElement>( '#selectionY' )
  const selectionWEl = strictSelect<HTMLInputElement>( '#selectionW' )
  const selectionHEl = strictSelect<HTMLInputElement>( '#selectionH' )

  if( rect === undefined ){
    selectionXEl.value = ''
    selectionYEl.value = ''
    selectionWEl.value = ''
    selectionHEl.value = ''

    return
  }

  const { x, y, width, height } = rectToStringRect( rect )

  selectionXEl.value = x
  selectionYEl.value = y
  selectionWEl.value = width
  selectionHEl.value = height
}
