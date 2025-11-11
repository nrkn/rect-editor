import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { createHandler } from '../lib/handlers/create-handler'
import { zoomIntensity } from '../consts'

export const handlePanWheel = (state: State) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const wheel = (e: WheelEvent) => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = state.viewTransform()

    const x = clientX - left
    const y = clientY - top

    const factor = Math.exp(-deltaY * zoomIntensity)
    const newScale = scale * factor

    state.zoomAt({ x, y, scale: newScale })
  }

  const enabler = () => {
    viewportEl.addEventListener('wheel', wheel)
  }

  const disabler = () => {
    viewportEl.removeEventListener('wheel', wheel)
  }

  return createHandler('pan-wheel', enabler, disabler)
}
