import { Point } from '../geometry/types'

export type HandleClick = ( 
  name: string,
  el: HTMLElement,
  onClick: OnHandleClick,
  options?: Partial<HandleClickOptions>
) => Handler

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
  name: string,
  el: HTMLElement,
  onDrag: OnHandleDrag,
  options?: Partial<DragOptions>
) => Handler

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

export type Handler = {
  name: () => string
  enable: () => void
  disable: () => void
  isActive: () => boolean
}