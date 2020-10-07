import { DefsManager } from '../lib/dom/defs'
import { Line, Rect, Size, Transform } from '../lib/geometry/types'

export const appModes = [ 'pan', 'draw', 'select' ] as const 

export type AppMode = typeof appModes[ number ]

export type ActionTypeMap = {
  add: AddAction
  delete: DeleteAction
  edit: EditAction
}

export type ActionType = keyof ActionTypeMap

export const actionTypes: Readonly<ActionType[]> = [ 
  'add', 'delete', 'edit' 
] as const

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
  creatingRectEl: SVGRectElement | null 
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
  actions: ActionList
}

export type AppDomEls = {
  viewportEl: HTMLElement
  formEl: HTMLFormElement
  svgEl: SVGSVGElement
  groupEl: SVGGElement
}

export type ActionElement = {
  rect: Rect
  previous?: Rect
  id: string 
}

export type EditActionElement = ActionElement & {
  previous: Rect
}

type ActionBase = {
  type: ActionType
  elements: ActionElement[]
}

export type AddAction = ActionBase & {
  type: 'add'
}

export type DeleteAction = ActionBase & {
  type: 'delete'
}

export type EditAction = ActionBase & {
  type: 'edit'
  elements: EditActionElement[]
}

export type Action = AddAction | DeleteAction | EditAction

export type ActionList = {
  list: Action[]
  nextIndex: number
}

export type ActionHandler<K extends ActionType> = ( 
  state: AppState, action: ActionTypeMap[ K ]
) => void

export type ActionHandlerMap = {
  [K in ActionType]: ActionHandler<K>
}
