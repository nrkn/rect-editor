import { form } from '../lib/dom/h'
import { strictSelect, strictFormRadioNodes } from '../lib/dom/util'
import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'
import { getAppRects } from './util'

export const handleStyles = (state: State) => {
  const toolsEl = strictSelect<HTMLFormElement>('#tools > form')
 
  const updateSelected = () => {
    const styleRadios = strictFormRadioNodes(toolsEl, 'fill')
    
    if( styleRadios.value === state.currentStyleId() ) return

    state.currentStyleId( styleRadios.value )

    if( state.mode() !== 'select' ) return

    const ids = state.selector.actions.get()

    if (ids.length === 0) return

    const appRects = getAppRects(ids)

    appRects.forEach(
      appRect =>
        Object.assign(appRect, { 'data-style': state.currentStyleId() })
    )

    state.rects.update(appRects)
  }

  const enabler = () => {
    toolsEl.addEventListener( 'change', updateSelected )
  }

  const disabler = () => {
    toolsEl.removeEventListener( 'change', updateSelected )
  }

  return createHandler( 'styles', enabler, disabler )
}
