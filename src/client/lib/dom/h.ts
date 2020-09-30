import { isNode } from "./predicates"
import { HArg } from "./types"
import { attr } from "./util"

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
export const fieldset = htmlElementFactory( 'fieldset' )  
export const legend = htmlElementFactory( 'legend' )  
export const label = htmlElementFactory( 'label' )
export const input = htmlElementFactory( 'input' )
export const button = htmlElementFactory( 'button' )
