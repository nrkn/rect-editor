import { appRectToFill } from '../handlers/util'
import { Collection } from '../lib/collection/types'
import { rect } from '../lib/dom/s'
import { attr, strictSelect } from '../lib/dom/util'
import { AppRect, AppStyle } from '../types'

export const createAppRectEl = (appRect: AppRect) => {
  const appRectEl = rect(
    { fill: 'rgba( 255, 255, 255, 0.5 )', stroke: 'rgba( 0, 0, 0, 0.5 )' }
  )

  attr( appRectEl, appRect )

  return appRectEl
}

export const updateAppRectEl = (
  styles: Collection<AppStyle>,
  appRect: AppRect,  
  appRectEl = strictSelect<SVGRectElement>(`#${appRect.id}`)
) => {
  const fill = appRectToFill( styles, appRect, 0.75 )

  attr(appRectEl, appRect, { fill })
}
