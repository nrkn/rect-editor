import { strictFormElement } from '../../lib/dom/util'
import { AppMode, appModes, AppState } from '../types'

const changeEvent = new Event('change')

export const switchMode = (state: AppState, mode: AppMode) => {
  const { formEl } = state.dom

  const modeEl = strictFormElement(formEl, 'mode')

  modeEl.value = mode

  formEl.dispatchEvent(changeEvent)
}

export const isAppMode = ( value: any ): value is AppMode => 
  appModes.includes( value )
