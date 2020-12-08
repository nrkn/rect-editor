import { attr, strictSelect } from '../lib/dom/util'
import { Positions } from '../lib/geometry/types'
import { State, Actions } from '../types'
import { handleDrag } from './handle-drag'
import { DragCallback, DragEventType } from './types'

import { 
  getBoundingRect, rectToSidesRect, scaleRectFrom, sidesRectToRect 
} from '../lib/geometry/rect'

import {
  createSnapTranslatePoint, getAppRects, getPosition, getResizerPositions
} from './util'
import { deltaPoint, snapPointToGrid } from '../lib/geometry/point'

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

    const delta = deltaPoint( end, prev )

    const dX = delta.x
    const dY = delta.y

    if (dX === 0 && dY === 0){
      return
    }

    const ids = actions.selection.get()
    const appRects = getAppRects(ids)
    const bounds = getBoundingRect(appRects)

    if (bounds === undefined){
      return
    }

    appRects.forEach(appRect => {
      const el = strictSelect(`#${ appRect.id }`)

      if( positions === null ) return

      const scaledRect = scaleRectFrom( 
        bounds, appRect, { x: dX, y: dY }, positions 
      )

      if( scaledRect === undefined ) return

      attr( el, scaledRect )
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
