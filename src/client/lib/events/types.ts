import { Point } from '../geometry/types'

export type Listener<T> = ( event: T ) => any

export type Disposable = {
  dispose: () => void
}

export type TypedEventEmitter<T> = {
  on: ( listener: Listener<T> ) => Disposable
  once: ( listener: Listener<T> ) => void
  off: ( listener: Listener<T> ) => void
  emit: ( event: T ) => void
}

export type PointerEmitterEvent = {
  position: Point
  isDragging: boolean
  isInside: boolean
  button: number
  mouseEvent: MouseEvent
}

export type PointerEmitterOptions = {
  preventDefault: boolean
  tapDistanceThreshold: number
  tapDelay: number
}

export type DragEmitterOptions = PointerEmitterOptions & {
  transformPoint: ( point: Point ) => Point
}
