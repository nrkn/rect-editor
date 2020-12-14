import { rect } from '../lib/dom/s'
import { attr, strictSelect } from '../lib/dom/util'
import { AppRect } from '../types'

export const createAppRectEl = (appRect: AppRect) => {
  const appRectEl = rect(
    { fill: 'rgba( 255, 255, 255, 0.5 )', stroke: 'rgba( 0, 0, 0, 0.5 )' }
  )

  updateAppRectEl(appRect, appRectEl)

  return appRectEl
}

export const updateAppRectEl = (
  appRect: AppRect,
  appRectEl = strictSelect<SVGRectElement>(`#${appRect.id}`)
) => {
  let { 'data-style': style } = appRect

  const fill = dataStyleToFill(style)

  attr(appRectEl, appRect, { fill })
}

export const dataStyleToFill = (style: string) => {
  if (style.startsWith('color')) {
    return style.replace('color ', '')
  }

  return 'none'
}