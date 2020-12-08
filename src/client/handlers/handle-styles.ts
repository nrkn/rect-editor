import { getCurrentStyle } from '../els/util'
import { strictSelect, strictFormRadioNodes } from '../lib/dom/util'
import { Actions } from '../types'
import { getAppRects } from './util'

export const handleStyles = (actions: Actions) => {
  const toolsEl = strictSelect<HTMLFormElement>('#tools > form')

  const styleRadios = strictFormRadioNodes(toolsEl, 'fill')

  const updateSelected = () => {
    const ids = actions.selection.get()

    if (ids.length === 0) return

    const appRects = getAppRects(ids)

    appRects.forEach(
      appRect =>
        Object.assign(appRect, { 'data-style': getCurrentStyle() })
    )

    actions.rects.update(appRects)
  }

  styleRadios.forEach(el => el.addEventListener('change', updateSelected))
}