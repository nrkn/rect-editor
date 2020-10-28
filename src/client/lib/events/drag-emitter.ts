import { createEmitter } from '.'
import { Line, Point } from '../geometry/types'
import { mouseButtons } from '../mouse-buttons'
import { createPointerEmitter } from './pointer-emitter'
import { DragEmitterOptions } from './types'

export const createDragEmitter = (
  target: HTMLElement, options: Partial<DragEmitterOptions> = {}
) => {
  const emitter = createPointerEmitter(target, options )

  let dragLine: Line | null = null

  const start = createEmitter<Line>()
  const dragging = createEmitter<Line>()
  const end = createEmitter<Line>()

  const { transformPoint = ( p: Point ) => p } = options

  emitter.up.on(() => {
    if( dragLine === null ) return

    end.emit( dragLine )
    
    dragLine = null
  })

  emitter.move.on(({ position, isDragging }) => {
    if (!isDragging) return
    
    // only drag with main/left mouse button
    if( !mouseButtons.main ){
      return
    }

    const { x, y } = transformPoint( position )

    if (dragLine === null) {
      dragLine = { x1: x, y1: y, x2: x, y2: y }

      start.emit( dragLine )
    }

    dragLine.x2 = x
    dragLine.y2 = y

    dragging.emit( dragLine )
  })

  return { start, dragging, end }
}
