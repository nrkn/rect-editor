import { Size } from '../../lib/geometry/types'
import { SelectActions } from '../../lib/select/types'
import { StrKey } from '../../lib/state/types'
import { RectChangeModel, rectModelKeys } from '../rect/types'

export type DocumentViewModel = RectChangeModel & DocumentStateModel

export type DocumentStateModel = {
  selection: string[]
  gridSize: Size
  cellSize: Size
}

export const documentStateKeys: StrKey<DocumentStateModel>[] = [ 
  'selection',
  'gridSize', 
  'cellSize'  
]

export const documentViewKeys: StrKey<DocumentViewModel>[] = [ 
  ...rectModelKeys, ...documentStateKeys
]

export type DocumentElements = {
  svgEl: SVGSVGElement
  groupEl: SVGGElement
  gridRectEl: SVGRectElement
}

export type DocumentActions = {
  undo: () => void
  redo: () => void
  toStart: ( ids: string[] ) => void
  toEnd: ( ids: string[] ) => void
  forward: ( ids: string[] ) => void
  back: ( ids: string[] ) => void
  selection: SelectActions
}
