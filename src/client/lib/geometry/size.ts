import { fitAndPosition } from 'object-fit-math'
import { ScaleTransform, Size } from './types'

export const zoomToFit = ( parent: Size, child: Size ) => {
  const { x: fx, y: fy, width: fw } = fitAndPosition(
    parent, child, 'contain', '50%', '50%'
  )

  const scale = fw / child.width
  const x = fx / scale
  const y = fy / scale

  const transform: ScaleTransform = { x, y, scale }

  return transform
}
