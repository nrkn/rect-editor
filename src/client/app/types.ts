import { DefsManager } from '../lib/dom/defs'
import { Line, Rect, Size, Transform } from '../lib/geometry/types'

export const appModes = [ 'pan', 'draw', 'select' ] as const 

export const actionTypes = [ 'add', 'delete', 'edit' ] as const

export type AppMode = typeof appModes[ number ]

export type ActionType = typeof actionTypes[ number ]

export type AppOptions = {
  gridSize: Size
  cellSize: Size
  minScale: number
  snap: Size
}

export type AppState = {
  mode: AppMode
  transform: Transform
  dom: AppDomEls
  options: AppOptions
  defsManager: DefsManager
  dragLine: Line | null
  creatingRectEl: SVGRectElement | null
  keys: Record<string,boolean>
  actions: ActionList
}

export type AppDomEls = {
  viewportEl: HTMLElement
  formEl: HTMLFormElement
  svgEl: SVGSVGElement
  groupEl: SVGGElement
}

type ActionBase = {
  type: ActionType
  rect: Rect
  id: string
}

export type AddAction = ActionBase & {
  type: 'add'
  rect: Rect
  id: string
}

export type DeleteAction = ActionBase & {
  type: 'delete'
  rect: Rect
  id: string
}

export type EditAction = ActionBase & {
  type: 'edit'
  previous: Rect
  rect: Rect
  id: string
}

export type Action = AddAction | DeleteAction | EditAction

export type ActionList = {
  list: Action[]
  nextIndex: number
}

export type ActionTypeMap = {
  add: AddAction
  delete: DeleteAction
  edit: EditAction
}