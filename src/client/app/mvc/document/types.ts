import { TypedEventEmitter } from '../../../lib/events/types'
import { Rect, Size, Transform } from '../../../lib/geometry/types'

export type RectDocument<TRect extends Rect> = {
  size: Size
  elements: RectElement<TRect>[]
  selection: string[]
}

export type RectElement<TRect extends Rect> = {
  id: string
  rect: TRect
  previous?: TRect
}

export type UpdateRectElement<TRect extends Rect> = RectElement<TRect> & {
  previous: TRect
}

export type CreateEvent<TRect extends Rect> = RectElement<TRect>[]

export type RemoveEvent = string[]

export type UpdateEvent<TRect extends Rect> = UpdateRectElement<TRect>[]

export type SelectEvent = string[]

export type DocumentEvents<TRect extends Rect> = {
  create: TypedEventEmitter<CreateEvent<TRect>>
  remove: TypedEventEmitter<RemoveEvent>
  update: TypedEventEmitter<UpdateEvent<TRect>>
  select: TypedEventEmitter<SelectEvent>
}

export type CommandElement<TRect extends Rect> = (
  RectElement<TRect> | UpdateRectElement<TRect>
)

export type CommandType = 'create' | 'remove' | 'update'

export type DocumentModel<TRect extends Rect> = { 
  create: (...rects: TRect[]) => void
  remove: (...ids: string[]) => void
  update: (...elements: RectElement<TRect>[]) => void
  undo: () => void
  redo: () => void
  document: () => RectDocument<TRect>
  events: DocumentEvents<TRect>
  select: ( ...values: string[] ) => void
  deselect: ( ...values: string[] ) => void
  isSelected: ( value: string ) => boolean
  selectNone: () => void
  toggleSelect: ( ...values: string[] ) => void
  selectAll: () => void
}

export type DocumentView<TRect extends Rect = Rect> = {
  render: () => SVGSVGElement
  create: ( ...elements: RectElement<TRect>[] ) => void
  update: ( ...elements: RectElement<TRect>[] ) => void
  remove: ( ...ids: string[] ) => void

  setViewSize: ( size: Size ) => void
  setTransform: ( transform: Transform ) => void
}
