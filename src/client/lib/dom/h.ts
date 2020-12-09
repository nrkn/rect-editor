import { isNode } from './predicates'
import { HArg } from './types'
import { attr } from './util'

export const h = <K extends keyof HTMLElementTagNameMap>(
  name: K, ...args: HArg[]
): HTMLElementTagNameMap[K] => {
  const el = document.createElement( name)

  args.forEach(arg => {
    if( isNode( arg ) || typeof arg === 'string' ){
      el.append( arg )
    } else {
      attr( el, arg )
    }
  })

  return el
}

export const fragment = ( ...args: ( Node | string )[] ) => {
  const documentFragment = document.createDocumentFragment()

  documentFragment.append( ...args )

  return documentFragment
}

export const text = ( value = '' ) => {
  const textNode = document.createTextNode( value )

  return textNode
}

export const htmlElementFactory = <K extends keyof HTMLElementTagNameMap>(
  name: K
) => 
  ( ...args: HArg[] ) => h( name, ...args )

export const div = htmlElementFactory( 'div' )
export const span = htmlElementFactory( 'span' )
export const fieldset = htmlElementFactory( 'fieldset' )  
export const legend = htmlElementFactory( 'legend' )  
export const label = htmlElementFactory( 'label' )
export const input = htmlElementFactory( 'input' )
export const button = htmlElementFactory( 'button' )
export const form = htmlElementFactory( 'form' )
export const canvas = htmlElementFactory( 'canvas' )
export const a = htmlElementFactory( 'a' )
export const select = htmlElementFactory( 'select' )
export const option = htmlElementFactory( 'option' )
export const header = htmlElementFactory( 'header' )
export const footer = htmlElementFactory( 'footer' )
export const main = htmlElementFactory( 'main' )
export const section = htmlElementFactory( 'section' )
export const p = htmlElementFactory( 'p' )
export const pre = htmlElementFactory( 'pre' )
export const ul = htmlElementFactory( 'ul' )
export const ol = htmlElementFactory( 'ol' )
export const li = htmlElementFactory( 'li' )
