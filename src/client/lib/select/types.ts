import { Disposable, Listener } from '../events/types'

export type ModifySelection<T = string> = ( values: T[] ) => void

export type SelectActions<T = string> = {
  add: ModifySelection<T>
  remove: ModifySelection<T>
  toggle: ModifySelection<T>
  clear: () => void
  any: () => boolean
  get: () => T[]
  set: ModifySelection<T>
}

export type Selector<T = string> = {
  actions: SelectActions<T>
  on: (listener: Listener<T[]>) => Disposable
}