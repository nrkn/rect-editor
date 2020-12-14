import { createAppEls } from './els/app'
import { createDocumentEl, updateBodyTransform, updateDocumentSize, updateGrid } from './els/document'
import { createInfo } from './els/info'
import { createLayers, updateLayersEl } from './els/layers'
import { createToolsEls, updateAppMode, updateSnapToGrid } from './els/tools'
import { createHandlers } from './handlers/create-handlers'
import { setMode } from './handlers/util'
import { button } from './lib/dom/h'
import { strictMapGet, strictSelect } from './lib/dom/util'
import { enableHandlers } from './lib/handlers/util'
import { createState } from './state/create-state'
import { App, AppMode, StateListeners } from './types'

let app: Partial<App> = {}

// --

const newApp = () => {  
  closeApp()

  document.querySelector( '#new' )?.remove()

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

  const onAppMode = ( appMode: AppMode ) => {
    updateAppMode( appMode )
    setMode( handlers, appMode )    
  }
 
  const listeners: StateListeners = {
    updateAppMode: onAppMode, 
    updateSnapToGrid, 
    updateViewSize: updateDocumentSize,
    updateDocumentSize: updateGrid,
    updateViewTransform: updateBodyTransform
  }

  const state = createState( listeners )

  const handlers = createHandlers(state)

  enableHandlers( handlers, ...handlers.keys() )

  state.mode('draw')
  state.snap({ width: 16, height: 16 })
  state.documentSize({ width: 1000, height: 1000 })

  document.body.dispatchEvent(new Event('resize'))

  state.zoomToFit()

  app = { appEl, viewportSectionEl, state, handlers }

  const newButtonEl = button({ id: 'new', type: 'button' }, 'New')
  const closeButtonEl = button({ type: 'button' }, 'Close')

  closeButtonEl.addEventListener('click', closeApp)

  newButtonEl.addEventListener('click', newApp)

  headerEl.append(newButtonEl, closeButtonEl)
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
    const newButtonEl = strictSelect<HTMLButtonElement>( '#new', appEl )

    appEl.remove()

    document.body.append( newButtonEl )
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

newApp()
redraw()
