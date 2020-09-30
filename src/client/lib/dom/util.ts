import { ElementAttributes, StrictSelect } from './types'

export const attr = (el: Element, ...attributeRecords: ElementAttributes[]) => {
  attributeRecords.forEach(
    attributes => {
      Object.keys(attributes).forEach(
        key => {
          const value = String(attributes[key])

          el.setAttribute(key, value)
        }
      )
    }
  )
}

export const strictSelect: StrictSelect = (
  selectors: string, el: ParentNode = document
) => {
  const result = el.querySelector(selectors)

  if (result === null)
    throw Error(`Expected ${selectors} to match something`)

  return result
}

export const strictFormElement = (formEl: HTMLFormElement, name: string) => {
  const el = formEl.elements.namedItem(name)

  if (el instanceof HTMLInputElement) return el

  if (el instanceof RadioNodeList) return el

  throw Error(
    `Expected an HTMLInputElement or RadioNodeList called ${name}`
  )
}
