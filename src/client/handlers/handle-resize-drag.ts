import { attr, strictSelect } from '../lib/dom/util'
import { Positions } from '../lib/geometry/types'
import { State, Actions } from '../types'
import { handleDrag } from './handle-drag'
import { DragCallback, DragEventType } from './types'

import { 
  getBoundingRect, rectToSidesRect, sidesRectToRect 
} from '../lib/geometry/rect'

import {
  createSnapTranslatePoint, getAppRects, getPosition, getResizerPositions
} from './util'

export const handleResizeDrag = (state: State, actions: Actions) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  let positions: Positions | null = null

  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (state.mode() !== 'select') return false

    if (type === 'start') {
      if (e.button !== 0) return false      

      const bounds = viewportEl.getBoundingClientRect()
      const point = transformPoint(getPosition(e, bounds))

      positions = getResizerPositions(point) || null

      if (positions !== null) {
        const [xPosition, yPosition] = positions

        if (xPosition === 'xCenter' && yPosition === 'yCenter') return false
      }
    }

    return positions !== null
  }

  const transformPoint = createSnapTranslatePoint(state)
  
  const onDrag: DragCallback = (_start, end, prev) => {
    if (positions === null)
      throw Error('Expected positions')

    const dX = end.x - prev.x
    const dY = end.y - prev.y

    if (dX === 0 && dY === 0){
      return
    }

    const [xPosition, yPosition] = positions
    const ids = actions.selection.get()
    const appRects = getAppRects(ids)
    const bounds = getBoundingRect(appRects)

    if (bounds === undefined){
      return
    }

    let scaleX = 1
    let scaleY = 1
    let translateX = 0
    let translateY = 0

    let newWidth = bounds.width
    let newHeight = bounds.height

    if (xPosition === 'left') {
      newWidth -= dX
      translateX = dX
    }

    if( xPosition==='right'){
      newWidth += dX
    }

    if( yPosition === 'top'){
      newHeight -= dY
      translateY = dY
    }

    if( yPosition === 'bottom' ){
      newHeight += dY
    }

    if( newWidth === 0 || newHeight === 0  ) return

    scaleX = Math.abs( newWidth / bounds.width )
    scaleY = Math.abs( newHeight / bounds.height )

    if( state.keys.Shift ){
      if( xPosition === 'left' || xPosition === 'right' ){
        scaleY = scaleX
      }
      
      if( yPosition === 'top' || yPosition === 'bottom' ){
        scaleX = scaleY
      }
    }

    appRects.forEach(appRect => {
      const el = strictSelect(`#${ appRect.id }`)

      let { top, right, bottom, left } = rectToSidesRect( appRect )

      if( newWidth < 0 ){
        left = right
        right = left + appRect.width

        if( xPosition === 'right'){
          positions![ 0 ] = 'left'
        } else if( xPosition === 'left' ){
          positions![ 0 ] = 'right'
        }
      }

      if( newHeight < 0 ){
        top = bottom
        bottom = top + appRect.height

        if( yPosition === 'top'){
          positions![ 1 ] = 'bottom'
        } else if( yPosition === 'bottom' ){
          positions![ 1 ] = 'top'
        }
      }

      top -= bounds.y
      right -= bounds.x
      bottom -= bounds.y
      left -= bounds.x
      
      top *= scaleY
      right *= scaleX
      bottom *= scaleY
      left *= scaleX

      top += bounds.y + translateY
      right += bounds.x + translateX
      bottom += bounds.y + translateY
      left += bounds.x + translateX

      const transformedRect = sidesRectToRect({ top, right, bottom, left })

      attr( el, transformedRect)
    })

    actions.selection.set(ids)
  }

  const onEnd: DragCallback = () => {
    positions = null

    const ids = actions.selection.get()
    const appRects = getAppRects(ids)

    actions.rects.update(appRects)
    actions.selection.set(ids)
  }

  return handleDrag(
    state,
    onDrag,
    { onEnd, transformPoint, predicate }
  )
}
