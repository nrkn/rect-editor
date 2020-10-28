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