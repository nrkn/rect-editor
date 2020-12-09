import { Point } from '../geometry/types'

export type HandleClick = ( 
  el: HTMLElement,
  onClick: OnHandleClick,
  options?: Partial<HandleClickOptions>
) => void

export type OnHandleClick<T = void> = ( 
  point: Point, button: number, e: MouseEvent  
) => T

export type HandleClickOptions = {
  transformPoint: ( p: Point ) => Point
  predicate: ClickPredicate
  minDragDistance: number
  minDragTime: number  
}

export type ClickPredicate = OnHandleClick<boolean>

export type HandleDrag = (
  el: HTMLElement,
  onDrag: OnHandleDrag,
  options?: Partial<DragOptions>
) => void

export type DragEventType = 'start' | 'drag' | 'end'

export type DragOptions = {
  onStart: OnHandleDrag
  onEnd: OnHandleDrag
  transformPoint: DragTransformPoint
  predicate: DragPredicate
}

export type DragTransformPoint = ( p: Point ) => Point

export type DragPredicate = ( e: MouseEvent, type: DragEventType ) => boolean

export type OnHandleDrag = ( start: Point, end: Point, prev: Point ) => void