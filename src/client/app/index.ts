import { g, rect, svg } from '../lib/dom/s'
import { attr, strictSelect } from '../lib/dom/util'
import { setViewBox } from '../lib/dom/geometry'
import { AppDomEls, AppMode, AppOptions, AppState, DragData } from './types'
import { createGridBg } from './image-generators/grid-bg'
import { createDefsManager } from '../lib/dom/defs'
import { initIOEvents } from './io'
import { initForm } from './tools'
import { populateForm } from './dom/form-tools'
import { CommandList } from './commands/types'
import { zoomToFit } from './actions/zoom'

export const createApp = (opts: Partial<AppOptions> = {}) => {
  const options: AppOptions = Object.assign({}, defaultOptions, opts)
  const state = initState(options)

  initResize(state)
  initForm(state)
  initIOEvents(state)

  zoomToFit(state)
}

const defaultOptions: AppOptions = {
  gridSize: { width: 1000, height: 1000 },
  cellSize: { width: 16, height: 16 },
  minScale: 0.1,
  snap: { width: 1, height: 1 },
}

const initState = (options: AppOptions) => {
  const transform = { x: 0, y: 0, scale: 1 }

  const { viewportEl, formEl } = getDomElements()

  /*
    needs to happen before anything else or the layout is weird - maybe we 
    are measuring something in createSVGElements? or when we trigger resize
    event manually?
  */
  populateForm( formEl )

  const { svgEl, groupEl, defsManager } = createSvgElements(options)

  viewportEl.append(svgEl)

  const mode: AppMode = 'pan'
  const dom: AppDomEls = { viewportEl, formEl, svgEl, groupEl }

  const dragData: DragData = {
    dragLine: null,
    creatingElId: null,
    draggingRect: null,
    selectingRect: null
  }

  const keys = {}

  const commands: CommandList = {
    list: [],
    nextIndex: 0
  }
  
  const state: AppState = { 
    mode, transform, dom, options, defsManager, dragData, keys, commands
  }

  return state
}

const getDomElements = () => {
  const mainEl = strictSelect('main')
  const viewportEl = strictSelect<HTMLElement>('#viewport', mainEl)
  const formEl = strictSelect('form', mainEl)

  return { viewportEl, formEl }
}

const createSvgElements = (options: AppOptions) => {
  const { gridSize, cellSize } = options

  const gridRect = Object.assign({ x: 0, y: 0 }, gridSize)

  const svgEl = svg()

  setViewBox(svgEl, gridRect)

  const groupEl = g()

  svgEl.append(groupEl)

  const defsManager = createDefsManager(svgEl)

  const { width: cw, height: ch } = cellSize
  const gridBg = createGridBg(cw, ch)

  defsManager.setPattern('gridBg', gridBg)

  const gridRectEl = rect()

  groupEl.append(gridRectEl)

  attr(
    gridRectEl,
    gridRect,
    {
      fill: 'url(#gridBg)',
    }
  )

  return { svgEl, groupEl, gridRectEl, defsManager }
}

const initResize = (state: AppState) => {
  const { viewportEl, svgEl } = state.dom

  const onResize = () => {
    const { width, height } = viewportEl.getBoundingClientRect()
    const rect = Object.assign({ x: 0, y: 0, width, height })

    setViewBox(svgEl, rect)
  }

  window.addEventListener('resize', onResize)

  const resizeEvent = new Event('resize')

  window.dispatchEvent(resizeEvent)
}
