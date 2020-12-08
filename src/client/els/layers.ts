import { getAllRectIds, getAppRects } from '../handlers/util'
import { selectActions } from "../state/select-actions"
import { button, fieldset, input, label, legend, li, ol } from '../lib/dom/h'
import { attr, strictSelect } from '../lib/dom/util'
import { AppRect, State } from '../types'
import { dataStyleToFill } from './rect'

export const createLayers = () => {
  return fieldset(
    legend('Layers'),
    button( { id: 'toFront', type: 'button', disabled: ''}, 'To Front' ),
    button( { id: 'forward', type: 'button', disabled: ''}, 'Forward' ),
    button( { id: 'backward', type: 'button', disabled: ''}, 'Backward' ),
    button( { id: 'toBack', type: 'button', disabled: ''}, 'To Back' ),
    ol(
      li( 
        label(          
        )
      )
    )
  )
}

export const updateLayers = ( state: State ) => {  
  const { getSelected, isAnySelected } = selectActions( state )

  const fieldsetEl = strictSelect('#layers fieldset')
  const listEl = strictSelect('ol', fieldsetEl)

  listEl.innerHTML = ''

  const allIds = getAllRectIds()
  const selectedIds = getSelected()
  const appRects = getAppRects( allIds ).reverse()  

  if( appRects.length === 0 ){
    listEl.append(
      li( 
        label(          
        )
      )
    )
  }

  listEl.append(
    ...appRects.map(
      r => {
        const isChecked = selectedIds.includes( r.id )

        return createLayerEl(r, isChecked)
      }
        
    )
  )

  const buttonEls = [ ...fieldsetEl.querySelectorAll( 'button' ) ]    

  const canMove = state.mode() === 'select' && isAnySelected()
  
  buttonEls.forEach( el => el.disabled = !canMove )
}

const createLayerEl = (appRect: AppRect, isChecked = false) => {
  const inputEl = input(
    { type: 'checkbox', name: 'selectedLayers', value: appRect.id }
  )

  const el = li(
    label(
      { style: `background: ${dataStyleToFill(appRect['data-style'])}` },
      inputEl
    )
  )

  if (isChecked) attr(inputEl, { checked: '' })

  return el
}
