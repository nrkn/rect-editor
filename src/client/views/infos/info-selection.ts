import { fieldset, legend } from '../../lib/dom/h'
import { strictSelect } from '../../lib/dom/util'
import { rectToStringRectFixed } from '../../lib/geometry/rect'
import { Rect } from '../../lib/geometry/types'
import { createInfoNumLabel } from '../util'

export const createInfoSelectionEl = () => {
  const fieldsetEl = fieldset(
    { id: 'selection' },
    legend('Selection'),
    createInfoNumLabel('x', 'selectionX'),
    createInfoNumLabel('y', 'selectionY'),
    createInfoNumLabel('w', 'selectionW'),
    createInfoNumLabel('h', 'selectionH'),
    createInfoNumLabel('a', 'selectionA'),
  )

  return fieldsetEl
}

export const updateInfoSelection = (rect?: Rect) => {
  const selectionXEl = strictSelect<HTMLInputElement>('#selectionX')
  const selectionYEl = strictSelect<HTMLInputElement>('#selectionY')
  const selectionWEl = strictSelect<HTMLInputElement>('#selectionW')
  const selectionHEl = strictSelect<HTMLInputElement>('#selectionH')
  const selectionAEl = strictSelect<HTMLInputElement>('#selectionA')

  if (rect === undefined) {
    selectionXEl.value = ''
    selectionYEl.value = ''
    selectionWEl.value = ''
    selectionHEl.value = ''
    selectionAEl.value = ''

    return
  }

  let a = '-'

  if (rect.width !== 0 && rect.height !== 0) {
    const aspect = rect.width / rect.height

    a = aspect.toFixed(3)
  }

  const { x, y, width, height } = rectToStringRectFixed(rect, 1)

  selectionXEl.value = x
  selectionYEl.value = y
  selectionWEl.value = width
  selectionHEl.value = height
  selectionAEl.value = a
}
