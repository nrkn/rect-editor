import { strictSelect } from '../lib/dom/util'
import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'

export const handleViewportResize = (state: State) => {
  const viewportEl = strictSelect('#viewport')

  const resize = () => {
    const { width, height } = viewportEl.getBoundingClientRect()

    state.viewSize({ width, height })
  }

  const enabler = () => {
    document.body.addEventListener('resize', resize )
  }

  const disabler = () => {
    document.body.removeEventListener('resize', resize )
  }

  return createHandler( 'viewport-resize', enabler, disabler )
}
