import { defaultGrid, defaultSnap } from './consts.js'
import { createAppEls } from './els/app'
import { 
  createDocumentEl, updateBodyTransform, updateDocumentSize 
} from './els/document'

import { hideModal } from './els/modal'
import { button, input } from './lib/dom/h'
import { strictMapGet, strictSelect } from './lib/dom/util'
import { isSize } from './lib/geometry/predicates'
import { noop } from './lib/util'
import { isAppRect } from './predicates'
import { createState } from './state/create-state'
import { App, DocumentData, StateListeners } from './types'

let app: Partial<App> = {}

// --

let defaultData: DocumentData = {
  rects: [],
  snap: defaultSnap,
  grid: defaultGrid,
  documentSize: { width: 1000, height: 1000 }
}

const newApp = (
  options: Partial<DocumentData> = {}
) => {
  closeApp()

  document.querySelector('#new')?.remove()

  const { rects, documentSize } = Object.assign({}, defaultData, options)

  const appEl = createAppEls()
  const documentEl = createDocumentEl()

  const viewportSectionEl = strictSelect('#viewport', appEl)
  const headerEl = strictSelect('header', appEl)

  viewportSectionEl.append(documentEl)

  document.body.append(appEl)

  hideModal()

  const listeners: StateListeners = {
    listenViewSize: updateDocumentSize,
    listenViewTransform: updateBodyTransform,

    listenAppMode: noop,
    listenBackgroundImage: noop,
    listenCurrentStyle: noop,
    listenDocumentSize: noop,
    listenSnapToGrid: noop,
    listenVisualGrid: noop
  }

  const state = createState([], listeners as StateListeners )

  state.documentSize(documentSize)

  state.rects.add(rects)

  document.body.dispatchEvent(new Event('resize'))

  state.zoomToFit()

  app = { appEl, viewportSectionEl, state }


  const loadButtonEl = input(
    { id: 'load', type: 'file', accept: '.json' }, 'Load'
  )
  const closeButtonEl = button({ type: 'button' }, 'Close')

  closeButtonEl.addEventListener('click', () => {
    if (confirm('Leave without saving?')) closeApp()
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
      } catch (err:any) {
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
    loadButtonEl,
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
      state.dirty = false
    }
  }

  requestAnimationFrame(redraw)
}

// ---

newApp()

redraw()
