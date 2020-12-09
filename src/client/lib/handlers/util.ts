import { Point } from '../geometry/types'

export const getPosition = (event: MouseEvent, bounds: DOMRect) => {
  const { clientX, clientY } = event
  const x = clientX - bounds.left
  const y = clientY - bounds.top
  const point: Point = { x, y }

  return point
}
