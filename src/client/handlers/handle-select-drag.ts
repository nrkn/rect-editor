import { rect } from '../lib/dom/s'
import { getRectElRect, strictSelect } from '../lib/dom/util'
import { rectIntersection } from '../lib/geometry/rect'
import { Rect } from '../lib/geometry/types'
import { State } from '../types'
import { handleAppRectDrag } from './util/handle-app-rect-drag'
import { getPosition } from '../lib/handlers/util'
import { selectActions } from '../state/select-actions'

import { 
  createSelectGetDragType, createTranslatePoint, getResizerPositions
} from './util'
import { DragEventType } from '../lib/handlers/types'

export const handleSelectDrag = (state: State) => {
  const { toggleSelected, setSelected } = selectActions( state )

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

  const getSelectDragType = createSelectGetDragType(state, transformPoint)

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
      toggleSelected( ids )
    } else {
      setSelected( ids )
    }
  }

  return handleAppRectDrag(
    'select-drag', state, predicate, transformPoint, createSelectDragRect, onEndRect
  )
}
