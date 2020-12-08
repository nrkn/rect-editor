import { appModes } from './consts'
import { Collection } from './lib/collection/types'
import { Rect, ScaleTransform, Size } from './lib/geometry/types'
import { SelectActions, Selector } from './lib/select/types'

export type AppMode = typeof appModes[ number ]

export type StateFn<T> = ( value?: T ) => T

export type StateData = {
  mode: StateFn<AppMode>
  snap: StateFn<Size>,
  viewSize: StateFn<Size>
  viewTransform: StateFn<ScaleTransform>
  documentSize: StateFn<Size>
}

export type State = {
  mode: StateFn<AppMode>
  snap: StateFn<Size>,
  viewSize: StateFn<Size>
  viewTransform: StateFn<ScaleTransform>
  documentSize: StateFn<Size>
  rects: Collection<AppRect>
  selector: Selector
  keys: Record<string,boolean>
  zoomToFit: () => void
  zoomAt: ( transform: ScaleTransform ) => void  
}

export type AppRect = Rect & { 
  id: string 
  'data-style': string
}

export type DocumentData = {
  snap: Size
  documentSize: Size
  rects: AppRect[]
}