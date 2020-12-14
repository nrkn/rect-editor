import { appModes } from './consts'
import { Collection } from './lib/collection/types'
import { Listener } from './lib/events/types'
import { Rect, ScaleTransform, Size } from './lib/geometry/types'
import { Handler } from './lib/handlers/types'
import { Selector } from './lib/select/types'

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
  dirty: boolean
  zoomToFit: () => void
  zoomAt: ( transform: ScaleTransform ) => void  
}

export type StateListeners = {
  updateAppMode: Listener<AppMode>
  updateSnapToGrid: Listener<Size>
  updateViewSize: Listener<Size>
  updateDocumentSize: Listener<Size>
  updateViewTransform: Listener<ScaleTransform>
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

export type App = {
  appEl: Element
  viewportSectionEl: Element
  state: State
  handlers: Map<string,Handler>
}
