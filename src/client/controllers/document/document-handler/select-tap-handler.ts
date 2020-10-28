import { strictSelect } from '../../../lib/dom/util'
import { createPointerEmitter } from '../../../lib/events/pointer-emitter'
import { Point } from '../../../lib/geometry/types'
import { keys } from '../../../lib/keys'
import { State } from '../../../lib/state/types'
import { AppModel } from '../../app/types'
import { DocumentActions } from '../types'
import { createTransformPoint, rectIdsAt } from './util'

export const startSelectTapHandler = (
  documentActions: DocumentActions,
  appState: State<AppModel>
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const { get: getState } = appState
  const pointerEvents = createPointerEmitter(viewportEl)
  const transformPoint = createTransformPoint(getState)

  const drawTap = (point: Point) => {    
    const rectIds = rectIdsAt(viewportEl, point)

    // TODO: handle in draw - prompt for rect
    if (rectIds.length === 0) return

    appState.set.appMode('select')

    selectTap(point)
  }

  const selectTap = (point: Point) => {
    const rectIds = rectIdsAt(viewportEl, point)

    if (rectIds.length === 0) {
      documentActions.selection.clear()

      return
    }

    const last = rectIds[rectIds.length - 1]

    if (keys.Shift) {
      documentActions.selection.toggle([last])
    } else {
      documentActions.selection.clear()
      documentActions.selection.add([last])
    }
  }

  pointerEvents.tap.on(({ position, button }) => {
    // TODO - add right click handler here
    if (button !== 0) return

    const point = transformPoint(position)

    if (getState.appMode() === 'draw') {
      drawTap(point)

      return
    }

    if (getState.appMode() === 'select') {
      selectTap(point)

      return
    }
  })
}