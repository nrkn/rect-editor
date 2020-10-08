import { DefsManager } from '../lib/dom/defs'
import { Line, Rect, Size, Transform } from '../lib/geometry/types'
import { CommandList } from './commands/types'

export const appModes = [ 'pan', 'draw', 'select' ] as const 

export type AppMode = typeof appModes[ number ]

export type AppOptions = {
  gridSize: Size
  cellSize: Size
  minScale: number
  snap: Size
}

export type EditingRect = {
  id: string
  initialRect: Rect
}

export type DragData = {
  dragLine: Line | null
  creatingElId: string | null 
  selectingRect: Rect | null
  draggingRect: EditingRect | null 
}

export type AppState = {
  mode: AppMode
  transform: Transform
  dom: AppDomEls
  options: AppOptions
  defsManager: DefsManager
  dragData: DragData
  keys: Record<string,boolean>
  commands: CommandList
}

export type AppDomEls = {
  viewportEl: HTMLElement
  formEl: HTMLFormElement
  svgEl: SVGSVGElement
  groupEl: SVGGElement
}
