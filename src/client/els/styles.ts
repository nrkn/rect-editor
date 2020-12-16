import { fieldset, input, label } from '../lib/dom/h'
import { attr, strictSelect } from '../lib/dom/util'
import { styleToFill } from '../state/create-app-styles'
import { State } from '../types'

const defaultOpacity = 0.75

export const createStyles = () => {
  const stylesEl = fieldset(
    { id: 'styles' }
  )

  return stylesEl
}

export const updateStyles = (state: State) => {
  const { styles } = state
  const selectedId = state.currentStyleId()

  const stylesEl = strictSelect<HTMLFieldSetElement>('#styles')

  const ids = styles.toArray().map(s => s.id)
  const existingEls = [...stylesEl.querySelectorAll('input')]
  const existingIds = existingEls.map(el => el.value)

  const removeIds = existingIds.filter(id => !ids.includes(id))
  const updateIds = existingIds.filter(id => ids.includes(id))
  const createIds = ids.filter(id => !existingIds.includes(id))

  const processIds = [...removeIds, ...ids]

  processIds.forEach(id => {
    const el = stylesEl.querySelector<HTMLInputElement>(
      `input[name="fill"][value="${id}"]`
    )

    if (el && removeIds.includes(id)) {
      el.remove()

      return
    }

    const style = styles.get(id)
    const isSelected = style.id === selectedId
    const fill = styleToFill(style, defaultOpacity)

    if (el === null) {
      if (createIds.includes(id) && fill) {
        const el = createFillStyle(id, fill, isSelected)

        stylesEl.append(el)
      }

      return
    }

    if (updateIds.includes(id)) {
      if (fill === undefined) return

      stylesEl.append(updateFillStyle(id, fill, isSelected))
    }
  })
}

const createFillStyle = (id: string, fill: string, checked = false) => {
  const radioEl = input(
    {
      type: 'radio',
      name: 'fill',
      value: id
    }
  )

  if (checked) {
    attr(radioEl, { checked: '' })
  }

  const labelEl = label(
    { class: 'style-radio-label', style: `background: ${fill}` },
    radioEl
  )

  return labelEl
}

const updateFillStyle = (id: string, fill: string, checked = false) => {
  const radioEl = strictSelect<HTMLInputElement>(`input[name="fill"][value="${id}"]`)

  if (checked) {
    attr(radioEl, { checked: '' })
  } else {
    radioEl.removeAttribute('checked')
  }

  const labelEl = radioEl.parentElement

  if (labelEl === null) throw Error('Expected parentElement')

  attr(labelEl, { style: `background: ${fill}` })

  return labelEl
}
