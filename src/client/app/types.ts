import { DefsManager } from '../lib/dom/defs'
import { Size, Transform } from '../lib/geometry/types'

export const appModes = [ 'pan', 'draw', 'select' ] as const 

export type AppMode = typeof appModes[ number ]

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
}

export type AppDomEls = {
  viewportEl: HTMLElement
  formEl: HTMLFormElement
  svgEl: SVGSVGElement
  groupEl: SVGGElement
}

