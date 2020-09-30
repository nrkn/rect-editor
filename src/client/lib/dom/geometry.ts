import { attr } from './util'
import { Rect, Transform } from '../geometry/types'

export const transformToSvg = ( { x, y, scale }: Transform ) => 
  `translate(${ x } ${ y }) scale(${ scale })`

export const getViewBoxRect = ( svg: SVGSVGElement ): Rect => 
  svg.viewBox.baseVal

export const setViewBox = ( 
  svg: SVGSVGElement, { x, y, width, height }: Rect
) => {
  attr( svg, { viewBox: [ x, y, width, height ].join( ' ' ) } )
}
