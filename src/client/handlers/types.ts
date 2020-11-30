import { Point } from '../lib/geometry/types'

export type DragEventType = 'start' | 'drag' | 'end'

export type DragOptions = {
  onStart: DragCallback
  onEnd: DragCallback
  transformPoint: DragTransformPoint
  predicate: DragPredicate
}

export type DragTransformPoint = ( p: Point ) => Point

export type DragPredicate = ( e: MouseEvent, type: DragEventType ) => boolean

export type DragCallback = ( start: Point, end: Point, prev: Point ) => void