import { Rect } from '../../lib/geometry/types'
import { State, StrKey } from '../../lib/state/types'

export type RectModel = {
  id: string
  rect: Rect
}

export type RectChangeModel = {
  createRects: RectModel[]
  updateRects: RectModel[]
  removeRects: string[]
  orderRects: string[]
}

export const rectModelKeys: StrKey<RectChangeModel>[] = [ 
  'createRects', 'updateRects', 'removeRects', 'orderRects'
]

export type RectState = State<RectChangeModel>
