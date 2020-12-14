import { createLine, distance } from '../geometry/line'
import { Point } from '../geometry/types'
import { createHandler } from './create-handler'
import { HandleClick, HandleClickOptions, Handler } from './types'
import { getPosition } from './util'

export const handleClick: HandleClick = (
  name, el, onClick, opts
) => {
  const {
    transformPoint, predicate, minDragDistance, minDragTime
  } = Object.assign({}, defaultOptions, opts)

  let startTime: number | null = null
  let startPosition: Point | null = null
  let startButton: number | null = null

  const down = (e: MouseEvent) => {
    const bounds = el.getBoundingClientRect()

    startButton = e.button
    startTime = Date.now()
    startPosition = transformPoint(getPosition(e, bounds))
  }

  const up = (e: MouseEvent) => {
    if( 
      startTime === null ||
      startPosition === null ||
      startButton === null
    ) return

    const bounds = el.getBoundingClientRect()

    const endTime = Date.now()

    if ((endTime - startTime) > minDragTime) return

    const endPosition = transformPoint(getPosition(e, bounds))

    const line = createLine(startPosition, endPosition)
    const dist = Math.abs(distance(line))

    if (dist > minDragDistance) return

    if (predicate(endPosition, startButton, e)) {
      onClick(endPosition, startButton, e)
    }
  }

  const enabler = () => {
    el.addEventListener('mousedown', down)
    el.addEventListener('mouseup', up)
  }

  const disabler = () => {
    el.removeEventListener('mousedown', down)
    el.removeEventListener('mouseup', up)
    
    startTime = null
    startPosition = null
    startButton = null
  }

  return createHandler(name, enabler, disabler)
}

const defaultOptions: HandleClickOptions = {
  transformPoint: (p: Point) => p,
  predicate: () => true,
  minDragDistance: 10,
  minDragTime: 300
}
