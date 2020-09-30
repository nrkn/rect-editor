import { zoomAt } from '../actions'
import { applyTransform, getLocalCenter, zoomToFit } from '../geometry'
import { AppState } from '../types'

export const keyHandler = (state: AppState, key: string) => {
  const { options } = state
  
  if (isResetZoom(key)) {
    zoomToFit(state)

    return
  }

  if (isZoom(key)) {
    const { x, y } = getLocalCenter(state)

    let scale = state.transform.scale

    if (key === '-') {
      scale = state.transform.scale - 0.25
    }

    if (key === '+') {
      scale = state.transform.scale + 0.25
    }

    if (scale !== state.transform.scale) {
      zoomAt(state, { x, y, scale })
    }

    return
  }

  if (isMove(key)) {
    const { cellSize } = options
    let { width, height } = cellSize

    let { x, y, scale } = state.transform

    width *= scale
    height *= scale

    if (key === 'ArrowLeft') {
      x += width
    }

    if (key === 'ArrowRight') {
      x -= width
    }

    if (key === 'ArrowUp') {
      y += height
    }

    if (key === 'ArrowDown') {
      y -= height
    }

    Object.assign(state.transform, { x, y })

    applyTransform(state)

    return
  }
}

const isResetZoom = (key: string) => key === '*'

const isZoom = (key: string) => ['-', '+'].includes(key)

const isMove = (key: string) =>
  ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)
