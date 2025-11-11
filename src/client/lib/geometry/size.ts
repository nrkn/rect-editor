import { fitAndPosition } from 'object-fit-math'
import { ScaleTransform, Size } from './types'

export const zoomToFit = (parent: Size, child: Size) => {
  const { x, y, width } = fitAndPosition(
    parent, child, 'contain', '50%', '50%'
  )

  const scale = width / child.width

  const transform: ScaleTransform = { x, y, scale }

  return transform
}
