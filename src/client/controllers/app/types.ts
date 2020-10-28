import { Size, Transform } from '../../lib/geometry/types'
import { StrKey } from '../../lib/state/types'
import { DocumentElements } from '../document/types'

export type AppModel = {
  appMode: AppMode
  snapSize: Size
  viewportSize: Size
  viewportTransform: Transform
}

export const appModelKeys: StrKey<AppModel>[] = [ 
  'appMode', 
  'snapSize', 
  'viewportSize', 
  'viewportTransform'
]

export type AppOptions = {
  gridSize: Size
  cellSize: Size
  minScale: number
  snap: Size
}

export type AppViewOptions = AppOptions & { elements: DocumentElements }

export type AppElements = {
  viewportEl: HTMLElement
}

export type AppActions = {
  zoomToFit: () => void
  zoomAt: ( transform: Transform ) => void
}

export const appModes = [ 'pan', 'draw', 'select' ] as const 

export type AppMode = typeof appModes[ number ]
