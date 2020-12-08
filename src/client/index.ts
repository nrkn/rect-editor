import { createActions } from './actions/create-actions'
import { createAppEls } from './els/app'
import { createDocumentEl } from './els/document'
import { createInfo } from './els/info'
import { createLayers, updateLayers } from './els/layers'
import { createToolsEls } from './els/tools'
import { createHandlers } from './handlers/create-handlers'
import { strictSelect } from './lib/dom/util'
import { createState } from './state/create-state'

const appEl = createAppEls()
const toolsEl = createToolsEls()
const documentEl = createDocumentEl()
const infoEl = createInfo()
const layersEl = createLayers()

const toolsSectionEl = strictSelect('#tools', appEl)
const viewportSectionEl = strictSelect('#viewport', appEl)
const layerSectionEl = strictSelect('#layers', appEl)
const footerEl = strictSelect('footer', appEl)

toolsSectionEl.append(toolsEl)
viewportSectionEl.append(documentEl)
layerSectionEl.append(layersEl)
footerEl.append(infoEl)

document.body.append(appEl)

const state = createState()

state.mode('draw')
state.snap({ width: 16, height: 16 })
state.documentSize({ width: 1000, height: 1000 })

const actions = createActions(state)

updateLayers(state, actions)
createHandlers(state, actions)

actions.zoomToFit()

const stateSerialized = JSON.stringify(
  state,
  (_key, value) => {
    if (typeof value === 'function') return value()

    return value
  },
  2
)

console.log(stateSerialized)
