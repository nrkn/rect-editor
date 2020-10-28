import { Listener, TypedEventEmitter } from '../events/types'

export type ID = { id: string }

export type Collection<T extends ID> = {
  add: ( elements: T[] ) => void
  remove: ( ids: string [] ) => void
  update: ( elements: T[] ) => void
  toStart: ( ids: string[] ) => void
  toEnd: ( ids: string[] ) => void
  forward: ( ids: string[] ) => void
  back: ( ids: string[] ) => void
  has: ( id: string ) => boolean
  get: ( id: string ) => T
  undo: () => boolean
  redo: () => boolean
  toArray: () => T[]
  on: CollectionListener<T>
}

export type CollectionListener<T extends ID> = {
  add: ( listener: Listener<T[]> ) => void
  remove: ( listener: Listener<string[]> ) => void
  update: ( listener: Listener<T[]> ) => void
  setOrder: ( listender: Listener<string[]> ) => void
}

export type AddCommand<T extends ID> = {
  type: 'add'
  elements: T[]
}

export type RemoveCommand<T extends ID> = {
  type: 'remove'
  before: string[]
  elements: T[]
}

export type Update<T extends ID> = {
  value: T
  prev: T
}

export type UpdateCommand<T extends ID> = {
  type: 'update'
  elements: Update<T>[]
}

export type OrderCommand = {
  type: 'order'
  before: string[]
  after: string[] 
}

export type CollectionCommand<T extends ID> = (
  AddCommand<T> | RemoveCommand<T> | UpdateCommand<T> | OrderCommand
)

export type CollectionTasks<T extends ID> = {
  addOne: (element: T) => T
  removeOne: (id: string) => T
  updateOne: (element: T) => Update<T>
  setOrder: ( ids: string[] ) => OrderCommand
}

export type CollectionEvents<T extends ID> = {
  add: TypedEventEmitter<T[]>
  remove: TypedEventEmitter<string[]>
  update: TypedEventEmitter<T[]>
  setOrder: TypedEventEmitter<string[]>
}