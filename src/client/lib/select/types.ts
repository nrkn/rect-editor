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