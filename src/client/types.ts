import { fitAndPosition } from 'object-fit-math'
import { FitMode } from 'object-fit-math/dist/types'
import { appModes } from './consts'
import { Collection } from './lib/collection/types'
import { Listener } from './lib/events/types'
import { Rect, ScaleTransform, Size } from './lib/geometry/types'
import { Handler } from './lib/handlers/types'
import { Selector } from './lib/select/types'

export type AppMode = typeof appModes[ number ]

export type StateFn<T> = ( value?: T ) => T

export type State = {
  mode: StateFn<AppMode>
  snap: StateFn<Size>,
  viewSize: StateFn<Size>
  viewTransform: StateFn<ScaleTransform>
  documentSize: StateFn<Size>
  currentStyleId: StateFn<string>
  backgroundImage: StateFn<BackgroundImage|undefined>
  styles: Collection<AppStyle>  
  rects: Collection<AppRect>
  selector: Selector
  keys: Record<string,boolean>
  dirty: boolean
  zoomToFit: () => void
  zoomAt: ( transform: ScaleTransform ) => void  
}

export type StateListeners = {
  listenAppMode: Listener<AppMode>
  listenSnapToGrid: Listener<Size>
  listenViewSize: Listener<Size>
  listenDocumentSize: Listener<Size>
  listenViewTransform: Listener<ScaleTransform>
  listenCurrentStyle: Listener<string>
  listenBackgroundImage: Listener<BackgroundImage|undefined>
}

export type BackgroundImage = {
  image: HTMLImageElement
  fitMode?: FitMode
  left?: string
  top?: string
}

export type AppRect = Rect & { 
  id: string 
  'data-style': string
}

export type AppStyle = {
  id: string
  type: string
  data: string
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
