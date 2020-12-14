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
