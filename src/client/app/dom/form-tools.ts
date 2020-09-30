import { button, div, fieldset, input, label, legend } from '../../lib/dom/h'
import { appModes, AppMode } from '../types'

export const populateForm = (formEl: HTMLFormElement) => {
  formEl.append(
    createPointerModes(),
    button({ type: 'button', id: 'resetZoom' }, 'Reset Zoom' ),
    createSizeEditor( 'Snap to Grid', 'cell' )
  )
}

const createPointerModes = () =>
  fieldset(
    legend('Pointer Mode'),
    ...appModes.map(createPointerMode)
  )

const createPointerMode = (mode: AppMode) =>
  div(
    label(
      input({ name: 'mode', type: 'radio', value: mode, checked: '' }),
      ` ${mode}`
    )
  )

const createSizeEditor = ( title: string, prefix: string ) =>
  fieldset(
    legend( title ),
    createIntegerEditor( 'Width', `${ prefix }Width` ),
    createIntegerEditor( 'Height', `${ prefix }Height` ),
  )

const createIntegerEditor = ( title: string, name: string ) =>
  div(
    label(
      title,
      input( { name, type: 'number', value: 1, min: 1, step: 1 } )
    )
  )
  