import { getAllRectIds, getAppRects } from '../handlers/util'
import { fieldset, input, label, legend, li, ol } from '../lib/dom/h'
import { attr, strictSelect } from '../lib/dom/util'
import { Actions, AppRect } from '../types'
import { dataStyleToFill } from './rect'

export const createLayers = () => {
  return fieldset(
    legend('Layers'),
    ol(
      li( 
        label(          
        )
      )
    )
  )
}

export const updateLayers = (actions: Actions) => {
  const fieldsetEl = strictSelect('#layers fieldset')
  const listEl = strictSelect('ol', fieldsetEl)

  listEl.innerHTML = ''

  const appRects = getAppRects(getAllRectIds()).reverse()
  const selectedIds = actions.selection.get()

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
      r =>
        createLayerEl(r, selectedIds.includes(r.id))
    )
  )
}

const createLayerEl = (appRect: AppRect, checked = false) => {
  const el = li(
    label(
      { style: `background: ${dataStyleToFill(appRect['data-style'])}` },
      input({ type: 'checkbox', name: 'selectedLayers', value: appRect.id })
    )
  )

  if (checked) attr(el, { checked: '' })

  return el
}