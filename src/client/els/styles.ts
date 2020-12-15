import { fieldset, input, label } from '../lib/dom/h'
import { isElement } from '../lib/dom/predicates'
import { attr, strictSelect } from '../lib/dom/util'
import { styleToFill } from '../state/create-styles'
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
  const childNodes = [...stylesEl.childNodes]

  childNodes.forEach(node => {
    if (isElement(node) && node.localName === 'legend') return

    node.remove()
  })

  styles.toArray().forEach(style => {
    const isSelected = style.id === selectedId

    const fill = styleToFill(style, defaultOpacity)

    if( fill === undefined ) return

    stylesEl.append( createFillStyle( style.id, fill, isSelected ) )
  })
}

const createFillStyle = ( id: string, fill: string, checked = false) => {
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
