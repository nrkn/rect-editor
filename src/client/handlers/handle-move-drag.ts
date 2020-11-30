import { attr, getRectElRect, strictSelect } from '../lib/dom/util'
import { State, Actions, AppRect } from '../types'
import { handleDrag } from './handle-drag'
import { DragCallback, DragEventType } from './types'
import { createSelectGetDragType, createTranslatePoint } from './util'

export const handleMoveDrag = (state: State, actions: Actions) => {
  const predicate = (e: MouseEvent, type: DragEventType) => {
    if (state.mode() !== 'select') return false

    if (type === 'start') {
      if (e.button !== 0) return false

      if (getSelectDragType(e) !== 'move') return false
    }

    return true
  }

  const transformPoint = createTranslatePoint(state)
  const getSelectDragType = createSelectGetDragType(actions, transformPoint)

  const onDrag: DragCallback = (_start, end, prev) => {
    const dX = end.x - prev.x
    const dY = end.y - prev.y

    if (dX === 0 && dY === 0) return

    const ids = actions.selection.get()

    const rectEls = ids.map(
      id => strictSelect<SVGRectElement>(`#${id}`)
    )

    rectEls.forEach(el => {
      let { x, y } = getRectElRect(el)

      x += dX
      y += dY

      attr(el, { x, y })
    })

    actions.selection.set(ids)
  }

  const onEnd: DragCallback = () => {
    const ids = actions.selection.get()

    const rectEls = ids.map(
      id => strictSelect<SVGRectElement>(`#${id}`)
    )

    const appRects = rectEls.map( el => {
      const { id } = el
      const rect = getRectElRect( el )

      const appRect: AppRect = Object.assign( { id }, rect )

      return appRect
    })

    actions.rects.update( appRects )

    actions.selection.set(ids)
  }

  return handleDrag(
    state,
    onDrag,
    { predicate, onEnd }
  )
}
