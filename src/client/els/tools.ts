import { button, div, fieldset, form, input, label, legend } from '../lib/dom/h'
import { appModes } from '../consts'
import { createStyles } from './styles'
import { AppMode } from '../types'
import { strictSelect, strictFormRadioNodes } from '../lib/dom/util'
import { isSize } from '../lib/geometry/predicates'
import { Size } from '../lib/geometry/types'
import { updateGridPattern } from './grid-pattern'

export const createToolsEls = () => {
  const toolsFormEl = form(
    div(
      { id: 'actionButtons' },
      button({ id: 'undo', type: 'button' }, 'Undo'),
      button({ id: 'redo', type: 'button' }, 'Redo'),
      button({ id: 'reset-zoom', type: 'button' }, 'Reset Zoom')
    ),
    fieldset(
      { id: 'pointerMode' },
      legend('Pointer Mode'),
      ...appModes.map(
        value => label(
          input({ type: 'radio', name: 'mode', value }),
          value
        )
      )
    ),
    fieldset(
      { id: 'snapToGrid' },
      legend('Snap to Grid'),
      label('Width', input({ id: 'snap-width', type: 'number', min: 1, step: 1 })),
      label('Height', input({ id: 'snap-height', type: 'number', min: 1, step: 1 }))
    ),
    createStyles()
  )

  return toolsFormEl
}

export const updateAppMode = (mode: AppMode) => {
  const toolsEl = strictSelect('#tools')
  const toolsFormEl = strictSelect('form', toolsEl)
  const modeRadioNodes = strictFormRadioNodes(toolsFormEl, 'mode')

  modeRadioNodes.value = mode
}

export const updateSnapToGrid = ( size: Size) => {
  const widthInputEl = strictSelect<HTMLInputElement>('#snap-width')
  const heightInputEl = strictSelect<HTMLInputElement>('#snap-height')

  widthInputEl.valueAsNumber = size.width
  heightInputEl.valueAsNumber = size.height
  
  updateGridPattern( size )
}