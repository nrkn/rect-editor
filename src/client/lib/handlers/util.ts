import { strictMapGet } from '../dom/util'
import { Point } from '../geometry/types'
import { Handler } from './types'

export const getPosition = (event: MouseEvent, bounds: DOMRect) => {
  const { clientX, clientY } = event
  const x = clientX - bounds.left
  const y = clientY - bounds.top
  const point: Point = { x, y }

  return point
}

export const enableHandlers = <T extends string = string>(
  handlers: Map<T, Handler>, ...keys: T[]
) =>
  keys.forEach(key => strictMapGet(handlers, key).enable())

export const disableHandlers = <T extends string = string>(
  handlers: Map<T, Handler>, ...keys: T[]
) =>
  keys.forEach(key => strictMapGet(handlers, key).enable())
