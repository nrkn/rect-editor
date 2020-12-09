import { strictSelect } from '../lib/dom/util'
import { State } from '../types'

export const handleViewportResize = (state: State) => {
  const viewportEl = strictSelect('#viewport')

  document.body.addEventListener('resize', () => {
    const { width, height } = viewportEl.getBoundingClientRect()

    state.viewSize({ width, height })
  })

  document.body.dispatchEvent(new Event('resize'))
}
