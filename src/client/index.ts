import { createAppEls } from './els/app'
import { createDocumentEl, updateBodyTransform, updateDocumentSize, updateGrid } from './els/document'
import { createInfo } from './els/info'
import { createLayers, updateLayersEl } from './els/layers'
import { hideModal, showModal, updateModal } from './els/modal'
import { createModalNewDocument, getModalNewDocumentValue } from './els/modals/modal-new-document'
import { updateStyles } from './els/styles'
import { createToolsEls, updateAppMode, updateSnapToGrid } from './els/tools'
import { createHandlers } from './handlers/create-handlers'
import { handleModalNewDocument } from './handlers/handle-modal-new-document'
import { setMode } from './handlers/handle-mode-change'
import { a, button, input } from './lib/dom/h'
import { strictFormElement, strictMapGet, strictSelect } from './lib/dom/util'
import { isSize } from './lib/geometry/predicates'
import { enableHandlers } from './lib/handlers/util'
import { noop } from './lib/util'
import { isAppRect } from './predicates'
import { createState } from './state/create-state'
import { App, AppMode, DocumentData, StateListeners } from './types'

let app: Partial<App> = {}

// --

let defaultData: DocumentData = {
  rects: [],
  snap: { width: 16, height: 16 },
  documentSize: { width: 1000, height: 1000 }
}

const newApp = (
  options: Partial<DocumentData> = {}
) => {
  closeApp()

  document.querySelector('#new')?.remove()

  const { rects, snap, documentSize } = Object.assign({}, defaultData, options)

  const appEl = createAppEls()
  const toolsEl = createToolsEls()
  const documentEl = createDocumentEl()
  const infoEl = createInfo()
  const layersEl = createLayers()

  const toolsSectionEl = strictSelect('#tools', appEl)
  const viewportSectionEl = strictSelect('#viewport', appEl)
  const layerSectionEl = strictSelect('#layers', appEl)
  const headerEl = strictSelect('header', appEl)
  const footerEl = strictSelect('footer', appEl)

  toolsSectionEl.append(toolsEl)
  viewportSectionEl.append(documentEl)
  layerSectionEl.append(layersEl)
  footerEl.append(infoEl)

  document.body.append(appEl)

  hideModal()

  const onAppMode = (appMode: AppMode) => {
    updateAppMode(appMode)
    setMode(handlers, appMode)
  }

  const listeners: StateListeners = {
    listenAppMode: onAppMode,
    listenSnapToGrid: updateSnapToGrid,
    listenViewSize: updateDocumentSize,
    listenDocumentSize: updateGrid,
    listenViewTransform: updateBodyTransform,
    // TODO
    listenCurrentStyle: noop
  }

  const state = createState([], listeners)

  updateStyles( state )

  const handlers = createHandlers(state)

  enableHandlers(handlers, ...handlers.keys())

  state.mode('draw')
  state.snap(snap)
  state.documentSize(documentSize)

  state.rects.add(rects)

  document.body.dispatchEvent(new Event('resize'))

  state.zoomToFit()

  app = { appEl, viewportSectionEl, state, handlers }

  const newButtonEl = button({ id: 'new', type: 'button' }, 'New')

  const loadButtonEl = input(
    { id: 'load', type: 'file', accept: '.json' }, 'Load'
  )
  const saveButtonEl = button({ id: 'save', type: 'button' }, 'Save')
  const closeButtonEl = button({ type: 'button' }, 'Close')

  closeButtonEl.addEventListener('click', () => {
    if (confirm('Leave without saving?')) closeApp()
  })

  const newDocHandler = handleModalNewDocument( newApp )  

  newButtonEl.addEventListener('click', () => {
    if (!confirm('Leave without saving?')) return

    newDocHandler.enable()    
  })

  let lastSaveName = 'rects.json'

  saveButtonEl.addEventListener('click', () => {
    const data: DocumentData = {
      snap: state.snap(),
      documentSize: state.documentSize(),
      rects: state.rects.toArray()
    }

    const json = JSON.stringify(data, null, 2)

    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const download = lastSaveName

    const actionEl = a({ href, download })

    document.body.append(actionEl)

    actionEl.click()

    actionEl.remove()
  })

  const reader = new FileReader()

  reader.addEventListener('load',
    () => {
      try {
        if (!confirm('Leave without saving?')) return

        const { result } = reader

        if (typeof result !== 'string') {
          throw Error('Expected the upload to be text')
        }

        const maybeDocument = JSON.parse(result) as Partial<DocumentData>

        if (!maybeDocument) throw Error('Expected file to be in JSON format')

        let { rects, snap, documentSize } = defaultData

        if (
          Array.isArray(maybeDocument.rects) &&
          maybeDocument.rects.every(isAppRect)
        ) {
          rects = maybeDocument.rects
        }

        if (isSize(maybeDocument.snap)) {
          snap = maybeDocument.snap
        }

        if (isSize(maybeDocument.documentSize)) {
          documentSize = maybeDocument.documentSize
        }

        newApp({ rects, snap, documentSize })
      } catch (err) {
        alert(err.message || 'An unknown error occurred')
      }
    },
    false
  )

  loadButtonEl.addEventListener('change', () => {
    if (loadButtonEl.files === null) return

    const file = loadButtonEl.files[0]

    if (file) {
      reader.readAsText(file)
    }
  })

  headerEl.append(
    newButtonEl,
    loadButtonEl,
    saveButtonEl
    //, closeButtonEl
  )
}

const closeApp = () => {
  const { handlers, appEl } = app

  if (handlers) {
    const names = [...handlers.keys()]

    names.forEach(
      name => strictMapGet(handlers, name).disable()
    )
  }

  if (appEl) {
    const newButtonEl = strictSelect<HTMLButtonElement>('#new', appEl)

    appEl.remove()

    document.body.append(newButtonEl)
  }

  app = {}
}

let lastSizeJson = ''

const redraw = () => {
  const { viewportSectionEl, state } = app

  if (viewportSectionEl && state) {
    const sizeJson = JSON.stringify(
      viewportSectionEl.getBoundingClientRect()
    )

    if (sizeJson !== lastSizeJson) {
      document.body.dispatchEvent(new Event('resize'))
      lastSizeJson = sizeJson
      state.dirty = true
    }

    if (state.dirty) {
      updateLayersEl(state)

      state.dirty = false
    }
  }

  requestAnimationFrame(redraw)
}

// ---

newApp()

redraw()
