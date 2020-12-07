import { rect } from '../lib/dom/s'
import { getRectElRect, strictSelect } from '../lib/dom/util'
import { rectIntersection } from '../lib/geometry/rect'
import { Rect } from '../lib/geometry/types'
import { Actions, State } from '../types'
import { handleRectDrag } from './handle-rect-drag'
import { DragEventType } from './types'
import { createSelectGetDragType, createTranslatePoint, getPosition, getResizerPositions } from './util'

export const handleSelectDrag = (state: State, actions: Actions) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const rectsEl = strictSelect<SVGGElement>('#rects')

  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (state.mode() !== 'select') return false

    if (type === 'start') {
      if (e.button !== 0) return false
      if (getSelectDragType(e) === 'move') return false

      const bounds = viewportEl.getBoundingClientRect()
      const point = transformPoint( getPosition( e, bounds ) )
      const positions = getResizerPositions( point )
  
      if( positions !== undefined ) return false      
    }

    return true
  }

  const transformPoint = createTranslatePoint(state)

  const getSelectDragType = createSelectGetDragType(actions, transformPoint)

  const createSelectDragRect = () => rect({ stroke: '#39f', fill: 'none' })

  const onEndRect = (dragRect: Rect) => {
    const rectEls = [...rectsEl.querySelectorAll('rect')]
    const ids: string[] = []

    rectEls.forEach(el => {
      const rectElRect = getRectElRect(el)

      if (rectIntersection(rectElRect, dragRect!) !== undefined) {
        ids.push(el.id)
      }
    })

    if (state.keys.shift) {
      actions.selection.toggle(ids)
    } else {
      actions.selection.set(ids)
    }
  }

  handleRectDrag(
    state, predicate, transformPoint, createSelectDragRect, onEndRect
  )
}
