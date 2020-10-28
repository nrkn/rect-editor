import { Line, Point } from '../../../lib/geometry/types'

export type DragHandler = {
  predicate: ( line: Line ) => boolean
  transformPoint: ( point: Point ) => Point
  start: ( line: Line ) => void
  dragging: ( line: Line ) => void
  end: ( line: Line ) => void
}
