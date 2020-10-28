import { Size, Point } from 'object-fit-math/dist/types'
import { createDragEmitter } from '../../lib/events/drag-emitter'
import { lineToVector } from '../../lib/geometry/line'
import { translateAndScalePoint } from '../../lib/geometry/transform'
import { Transform } from '../../lib/geometry/types'
import { State } from '../../lib/state/types'
import { AppModel, AppMode, AppElements, AppActions } from './types'

export const startAppHandler = ( 
  { viewportEl }: AppElements,
  state: State<AppModel>,
  actions: AppActions
) => {
  const getTransform = () =>
    state.get.viewportTransform()

  const getMode = () =>
    state.get.appMode()

  resizeEvents(viewportEl, state.set.viewportSize)
  wheelEvents(viewportEl, getTransform, actions.zoomAt)
  pointerEvents(viewportEl, getTransform, getMode, state.set.viewportTransform)  
}

const resizeEvents = (
  viewportEl: Element, 
  setViewportSize: (size: Size) => void
) => {
  const resizeEvent = new Event('resize')

  window.addEventListener('resize', () => {
    const { width, height } = viewportEl.getBoundingClientRect()

    setViewportSize({ width, height })
  })

  window.dispatchEvent(resizeEvent)
}

const wheelEvents = (
  viewportEl: HTMLElement,
  getTransform: () => Transform,
  zoomAt: (transform: Transform) => void
) => {
  viewportEl.addEventListener('wheel', e => {
    e.preventDefault()

    const { left, top } = viewportEl.getBoundingClientRect()
    const { deltaY, clientX, clientY } = e
    const { scale } = getTransform()

    const x = clientX - left
    const y = clientY - top

    const newScale = scale + deltaY * -0.1

    zoomAt({ x, y, scale: newScale })
  })
}

const pointerEvents = (
  viewportEl: HTMLElement,
  getTransform: () => Transform,
  getMode: () => AppMode,
  setTransform: (transform: Transform) => void
) => {
  const transformPoint = ( p: Point) => 
    translateAndScalePoint( p, getTransform())

  const emitter = createDragEmitter(viewportEl, { transformPoint })

  emitter.dragging.on(line => {
    if (getMode() !== 'pan') return

    let transform = getTransform()

    const { x: dX, y: dY } = lineToVector(line)

    transform.x += dX
    transform.y += dY

    setTransform(transform)
  })
}
