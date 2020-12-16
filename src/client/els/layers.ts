import { appRectToFill, getAllRectIds, getAppRects } from '../handlers/util'
import { selectActions } from '../state/select-actions'
import { button, fieldset, input, label, legend, li, ol } from '../lib/dom/h'
import { attr, strictSelect } from '../lib/dom/util'
import { AppRect, State } from '../types'
import { styleToFill } from '../state/create-app-styles'

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

export const updateLayersEl = ( state: State ) => {  
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
        const fill = appRectToFill( state.styles, r, 1 )

        return createLayerEl(r, fill, isChecked)
      }        
    )
  )

  const buttonEls = [ ...fieldsetEl.querySelectorAll( 'button' ) ]    

  const canMove = state.mode() === 'select' && isAnySelected()
  
  buttonEls.forEach( el => el.disabled = !canMove )
}

const createLayerEl = (appRect: AppRect, fill: string, isChecked = false) => {
  const inputEl = input(
    { type: 'checkbox', name: 'selectedLayers', value: appRect.id }
  )

  let labelText = appRect.id

  const rectIdSegs = appRect.id.split( '-' )

  if( rectIdSegs.length > 1 ){
    const [ name, index ] = rectIdSegs

    labelText = `${ name } ${ index }`
  }

  const el = li(
    label(
      { style: `background: ${ fill }` },
      inputEl,
      labelText
    )
  )

  if (isChecked) attr(inputEl, { checked: '' })

  return el
}
