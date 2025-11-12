import { strictSelect } from '../lib/dom/util'
import { State } from '../types'
import { createHandler } from '../lib/handlers/create-handler'

export const handleViewportKeys = (state: State) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const zoomAtCenter = (factor: number) => {
    const { width, height } = viewportEl.getBoundingClientRect()

    const { scale } = state.viewTransform()
    const newScale = scale * factor

    state.zoomAt({ x: width / 2, y: height / 2, scale: newScale })
  }

  const down = (e: KeyboardEvent) => {
    // avoid interfering with text inputs/contenteditable
    const target = e.target as HTMLElement | null
    if (
      target && target.closest('input, textarea, [contenteditable="true"]')
    ) return

    const key = e.key

    if (key === '+' || key === '=') {
      e.preventDefault()
      // modest zoom step
      zoomAtCenter(1.1)
    } else if (key === '-') {
      e.preventDefault()
      zoomAtCenter(1 / 1.1)
    } else if (key === '*') {
      e.preventDefault()

      state.zoomToFit()
    }
  }

  const enabler = () => {
    document.addEventListener('keydown', down)
  }

  const disabler = () => {
    document.removeEventListener('keydown', down)
  }

  return createHandler('viewport-keys', enabler, disabler)
}
