import { fitAndPosition } from 'object-fit-math'
import { transformRelativeTo } from '../../lib/geometry/transform'
import { Transform } from '../../lib/geometry/types'
import { applyTransform } from '../geometry'
import { AppState } from '../types'

export const zoomToFit = (state: AppState) => {
  const { viewportEl } = state.dom
  const { gridSize } = state.options

  const parentSize = viewportEl.getBoundingClientRect()

  const { x: fx, y: fy, width: fw } = fitAndPosition(
    parentSize, gridSize, 'contain', '50%', '50%'
  )

  const scale = fw / gridSize.width
  const x = fx / scale
  const y = fy / scale

  Object.assign(state.transform, { x, y, scale })

  applyTransform(state)
}

export const zoomAt = ( state: AppState, { scale, x, y }: Transform ) => {
  const { options } = state
  const { minScale } = options

  if( scale < minScale ) scale = minScale
  
  const newTransform = transformRelativeTo(
    state.transform, scale, { x, y }
  )

  Object.assign(state.transform, newTransform)

  applyTransform(state)
}
