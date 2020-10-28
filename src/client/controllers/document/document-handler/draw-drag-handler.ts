import { Collection } from '../../../lib/collection/types'
import { Line } from '../../../lib/geometry/types'
import { SelectActions } from '../../../lib/select/types'
import { SetStateRecord, GetStateRecord } from '../../../lib/state/types'
import { randomId } from '../../../lib/util'
import { AppModel } from '../../app/types'
import { RectModel } from '../../rect/types'
import { DocumentViewModel } from '../types'
import { DragHandler } from './types'
import { createSnappedTransformPoint, lineToRect } from './util'

export const createDrawDragHandler = (
  render: SetStateRecord<DocumentViewModel>,
  rectCollection: Collection<RectModel>,
  selection: SelectActions,
  getState: GetStateRecord<AppModel>
) => {
  const getMode = () =>
    getState.appMode()

  let rectModel: RectModel | null = null

  const predicate = () => getMode() === 'draw'

  const transformPoint = createSnappedTransformPoint(getState)

  const start = (line: Line) => {
    if (getMode() !== 'draw') return

    const id = randomId()
    const rect = lineToRect(line)

    rectModel = { id, rect }

    render.createRects([rectModel])
  }

  const dragging = (line: Line) => {
    if (rectModel === null)
      throw Error('Expected rectModel')

    rectModel.rect = lineToRect(line)

    render.updateRects([rectModel])
  }

  const end = () => {
    if (rectModel === null)
      throw Error('Expected rectMessage')

    render.removeRects([rectModel.id])

    const { width, height } = rectModel.rect

    if (width >= 1 && height >= 1) {
      rectCollection.add([rectModel])
      selection.clear()
      selection.add([rectModel.id])
    }

    rectModel = null
  }

  const drawDragHandler: DragHandler = {
    predicate,
    transformPoint,
    start, 
    dragging,
    end
  }

  return drawDragHandler
}
