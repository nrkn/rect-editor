import { Disposable, Listener, TypedEventEmitter } from '../events/types'

export type StrKey<T> = keyof T & string

export type GetStateValue<T,K extends StrKey<T>> = () => T[K]

export type SetStateValue<T,K extends StrKey<T>> = ( value: T[K] ) => void

export type MapStateValue<T,K extends StrKey<T>> = ( value: T[K] ) => T[K]

export type ListenStateValue<T,K extends StrKey<T>> = ( 
  listener: Listener<T[K]> 
) => Disposable

export type EmitterStateValue<T,K extends StrKey<T>> = TypedEventEmitter<T[K]>

export type GetStateRecord<T> = {
  [ key in StrKey<T> ]: GetStateValue<T,key>
}

export type SetStateRecord<T> = {
  [ key in StrKey<T> ]: SetStateValue<T,key>
}

export type MapStateRecord<T> = {
  [ key in StrKey<T> ]: MapStateValue<T,key>
}

export type EventRecord<T> = {
  [ key in StrKey<T> ]: EmitterStateValue<T,key>
}

export type OnRecord<T> = {
  [ key in StrKey<T> ]: ListenStateValue<T,key>
}

export type State<T> = {
  get: GetStateRecord<T>
  set: SetStateRecord<T>
}

export type EventedState<T> = State<T> & {
  on: OnRecord<T>
}
