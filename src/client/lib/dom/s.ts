import { svgNs } from './consts'
import { isElement, isSVGElement } from './predicates'
import { SArg } from './types'
import { attr } from './util'

export const s = <K extends keyof SVGElementTagNameMap>(
  name: K, ...args: SArg[]
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS(svgNs, name)

  args.forEach(arg => {
    if (isSVGElement(arg) || isElement( arg ) || typeof arg === 'string' ) {
      el.append(arg)
    } else {
      attr(el, arg)
    }
  })

  return el
}

export const svgElementFactory = <K extends keyof SVGElementTagNameMap>(
  name: K
) => 
  ( ...args: SArg[] ) => s( name, ...args )

export const svg = svgElementFactory( 'svg' )
export const g = svgElementFactory( 'g' )
export const rect = svgElementFactory( 'rect' )
export const circle = svgElementFactory( 'circle' )
export const defs = svgElementFactory( 'defs' )
export const image = svgElementFactory( 'image' )
export const pattern = svgElementFactory( 'pattern' )
export const path = svgElementFactory( 'path' )
export const line = svgElementFactory( 'line' )
export const clipPath = svgElementFactory( 'clipPath' )
export const use = svgElementFactory( 'use' )
export const text = svgElementFactory( 'text' )
export const style = svgElementFactory( 'style' )
