import { Rect } from '../geometry/types'
import { ElementAttributes, StrictSelect, StyleDefinitions } from './types'

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

export const applyStyles = ( el: HTMLElement, ...styles: StyleDefinitions[] ) => {
  styles.forEach(
    styleDefs => {
      Object.keys( styleDefs ).forEach(
        key => {
          const value = String( styleDefs[ key ] )

          el.style[ key ] = value
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

export const strictFieldsetElement = (fieldsetEl: HTMLFieldSetElement, name: string) => {
  const el = fieldsetEl.elements.namedItem(name)

  if (el instanceof HTMLInputElement) return el

  if (el instanceof RadioNodeList) return el

  throw Error(
    `Expected an HTMLInputElement or RadioNodeList called ${name}`
  )
}

export const strictFieldsetRadioNodes = (
  fieldsetEl: HTMLFieldSetElement, name: string
) => {
  const el = fieldsetEl.elements.namedItem(name)

  if (el instanceof RadioNodeList) return el

  throw Error(
    `Expected a RadioNodeList called ${name}`
  )
}

export const strictFormRadioNodes = (
  formEl: HTMLFormElement, name: string
) => {
  const el = formEl.elements.namedItem(name)

  if (el instanceof RadioNodeList) return el

  throw Error(
    `Expected a RadioNodeList called ${name}`
  )
}

export const strictGetData = ( el: HTMLElement | SVGElement, key: string ) => {
  const value = el.dataset[ key ]

  if( value === undefined ) 
    throw Error( `Expected element dataset to contain ${ key }` )
  
  return value
}

export const strictFind = <T>( 
  elements: T[], 
  predicate: (value: T, index: number, obj: T[]) => boolean 
) => {
  const result = elements.find( predicate )

  if( result === undefined )
    throw Error( `Expected predicate to match something` )

  return result
}

export const strictMapGet = <K,T>(
  map: Map<K,T>, key: K
) => {
  const value = map.get( key )

  if( value === undefined ) throw Error( `Expected map to contain ${ key }` )
  
  return value
}

export const getKeys = <T>( obj: T ) => 
  Object.keys( obj ) as ( keyof T & string )[]

export const clone = <T>( obj: T ) => JSON.parse( JSON.stringify( obj ) ) as T


export const getRectElRect = (
  rectEl: SVGRectElement
) => {
  const { x: ex, y: ey, width: ew, height: eh } = rectEl

  const x = ex.baseVal.value
  const y = ey.baseVal.value
  const width = ew.baseVal.value
  const height = eh.baseVal.value

  const rect: Rect = { x, y, width, height }

  return rect
}

export const setRectElRect = (
  rectEl: SVGRectElement, rect: Partial<Rect>
) => {
  const initialRect = getRectElRect( rectEl )

  const { x, y, width, height } = Object.assign(
    {}, initialRect, rect
  )

  rectEl.x.baseVal.value = x
  rectEl.y.baseVal.value = y
  rectEl.width.baseVal.value = width
  rectEl.height.baseVal.value = height
}
