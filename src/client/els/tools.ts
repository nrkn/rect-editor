import { button, div, fieldset, form, input, label, legend } from '../lib/dom/h'
import { appModes } from '../consts'

export const createToolsEls = () => {
  const toolsFormEl = form(
    div(
      button({ id: 'undo', type: 'button' }, 'Undo'),
      button({ id: 'redo', type: 'button' }, 'Redo'),
      button({ id: 'reset-zoom', type: 'button' }, 'Reset Zoom')  
    ),
    fieldset(
      legend('Pointer Mode'),
      ...appModes.map(
        value => label(
          input({ type: 'radio', name: 'mode', value }),
          value
        )
      )
    ),
    fieldset(
      legend('Snap to Grid'),
      label('Width', input({ id: 'snap-width', type: 'number', min: 1, step: 1 })),
      label('Height', input({ id: 'snap-height', type: 'number', min: 1, step: 1 }))
    )
  )

  return toolsFormEl
}
