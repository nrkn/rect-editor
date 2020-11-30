import { appModes } from './consts'
import { Collection } from './lib/collection/types'
import { Rect, ScaleTransform, Size } from './lib/geometry/types'
import { SelectActions } from './lib/select/types'

export type AppMode = typeof appModes[ number ]

export type StateFn<T> = ( value?: T ) => T

export type State = {
  mode: StateFn<AppMode>
  snap: StateFn<Size>,
  viewSize: StateFn<Size>
  viewTransform: StateFn<ScaleTransform>
  documentSize: StateFn<Size>
  keys: Record<string,boolean>
}

export type Actions = {
  zoomToFit: () => void
  zoomAt: ( transform: ScaleTransform ) => void  
  rects: Collection<AppRect>
  selection: SelectActions
}

export type AppRect = Rect & { id: string }
