import { Collection } from '../../lib/collection/types'
import { getRectElRect } from '../../lib/dom/geometry'
import { rect } from '../../lib/dom/s'
import { attr, strictSelect } from '../../lib/dom/util'
import { createDragEmitter } from '../../lib/events/drag-emitter'
import { createPointerEmitter } from '../../lib/events/pointer-emitter'
import { getStart, lineToVector, normalizeLine } from '../../lib/geometry/line'
import { snapPointToGrid } from '../../lib/geometry/point'
import { rectContainsPoint } from '../../lib/geometry/rect'
import { translateAndScalePoint } from '../../lib/geometry/transform'
import { Line, Point } from '../../lib/geometry/types'
import { keys } from '../../lib/keys'
import { GetStateRecord, SetStateRecord, State } from '../../lib/state/types'
import { randomId } from '../../lib/util'
import { AppModel } from '../app/types'
import { RectModel } from '../rect/types'
import { DocumentActions, DocumentViewModel } from './types'

export const startDocumentHandler = (
  render: SetStateRecord<DocumentViewModel>,
  rectCollection: Collection<RectModel>,
  documentActions: DocumentActions,
  appState: State<AppModel>
) => {
  drawEvents(render, rectCollection, appState.get)
  keyEvents(rectCollection, documentActions)
  selectEvents(documentActions, appState)
}

const drawEvents = (
  render: SetStateRecord<DocumentViewModel>,
  rectCollection: Collection<RectModel>,
  getState: GetStateRecord<AppModel>
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const getMode = () =>
    getState.appMode()

  const transformPoint = createSnappedTransformPoint(getState)

  const drag = createDragEmitter(viewportEl, { transformPoint })

  let rectModel: RectModel | null = null

  drag.start.on(line => {
    if (getMode() !== 'draw') return

    const id = randomId()
    const rect = lineToRect(line)

    rectModel = { id, rect }

    render.createRects([rectModel])
  })

  drag.dragging.on(line => {
    if (getMode() !== 'draw') return

    if (rectModel === null)
      throw Error('Expected rectModel')

    rectModel.rect = lineToRect(line)

    render.updateRects([rectModel])
  })

  drag.end.on(() => {
    if (getMode() !== 'draw') return

    if (rectModel === null)
      throw Error('Expected rectMessage')

    render.removeRects([rectModel.id])

    const { width, height } = rectModel.rect

    if (width >= 1 && height >= 1) {
      rectCollection.add([rectModel])
    }

    rectModel = null
  })
}

const selectEvents = (
  documentActions: DocumentActions,
  appState: State<AppModel>
) => {
  const { get: getState } = appState
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const groupEl = strictSelect<SVGGElement>( 'svg > g', viewportEl )

  const pointerEvents = createPointerEmitter(viewportEl)
  const dragEvents = createDragEmitter(viewportEl)

  const transformPoint = createTransformPoint(getState)

  const panTap = () => {
    documentActions.selection.clear()
  }

  const drawTap = (point: Point) => {
    const rectIds = rectIdsAt(viewportEl, point)

    if (rectIds.length === 0) {
      // TODO: prompt for dimensions

      return
    }

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

    if (getState.appMode() === 'pan') {
      panTap()

      return
    }

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

  let selectRectEl: SVGRectElement | null = null

  dragEvents.start.on(line => {
    if( getState.appMode() !== 'select' ) return

    if (documentActions.selection.any()) {
      // TODO drag to move

      return
    }

    const lineRect = lineToRect(line)

    selectRectEl = rect(
      { class: 'selectRectEl' }, lineRect
    )

    groupEl.append( selectRectEl )
  })

  dragEvents.dragging.on(line => {
    if( getState.appMode() !== 'select' ) return

    if (documentActions.selection.any()) {
      // TODO drag to move

      return
    }

    if( selectRectEl === null ) throw Error( 'Expected selectRectEl' )

    const lineRect = lineToRect(line)

    attr( selectRectEl, lineRect )
  })

  dragEvents.end.on(() => {
    if( getState.appMode() !== 'select' ) return
    
    if (documentActions.selection.any()) {
      // TODO drag to move

      return
    }

    // select all in rect

    selectRectEl?.remove()
    selectRectEl = null
  })
}

const keyEvents = (
  rectCollection: Collection<RectModel>,
  documentActions: DocumentActions
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  document.addEventListener('keydown', e => {
    if (keys.Control && e.key.toLowerCase() === 'z') {
      e.preventDefault()

      keys.Shift ? documentActions.redo() : documentActions.undo()

      return
    }

    if (keys.Control && e.key.toLowerCase() === 'a') {
      e.preventDefault()

      documentActions.selection.clear()

      if (!keys.Shift) {
        documentActions.selection.add(getAllRectIds(viewportEl))
      }
    }

    if (e.key === 'Delete') {
      const selectedIds = documentActions.selection.get()

      if (selectedIds.length === 0) return

      rectCollection.remove(selectedIds)
      documentActions.selection.clear()
    }
  })
}

const lineToRect = (line: Line) => {
  const normal = normalizeLine(line)
  const { x, y } = getStart(normal)
  const { x: width, y: height } = lineToVector(normal)

  const rect = { x, y, width, height }

  return rect
}

const getAllRectEls = (viewportEl: HTMLElement) => {
  const rectEls = viewportEl.querySelectorAll<SVGRectElement>('.rectEl')

  return [...rectEls]
}

const getAllRectIds = (viewportEl: HTMLElement) =>
  getAllRectEls(viewportEl).map(el => el.id)

const createSnappedTransformPoint = (getState: GetStateRecord<AppModel>) =>
  (point: Point) =>
    snapPointToGrid(
      translateAndScalePoint(point, getState.viewportTransform()), 
      getState.snapSize()
    )

const createTransformPoint = (getState: GetStateRecord<AppModel>) =>
  (point: Point) =>
    translateAndScalePoint(point, getState.viewportTransform())

// if multiple ids, the last one is topmost
const rectIdsAt = (viewportEl: HTMLElement, point: Point) => {
  const ids: string[] = []
  const rectEls = getAllRectEls(viewportEl)

  rectEls.forEach(el => {
    const rect = getRectElRect(el)

    if (rectContainsPoint(rect, point)) {
      ids.push(el.id)
    }
  })

  return ids
}