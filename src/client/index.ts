import { createActions } from './actions/create-actions'
import { createAppEls } from './els/app'
import { createDocumentEl } from './els/document'
import { createToolsEls } from './els/tools'
import { createHandlers } from './handlers/create-handlers'
import { strictSelect } from './lib/dom/util'
import { createState } from './state/create-state'

const appEl = createAppEls()
const toolsEl = createToolsEls()
const documentEl = createDocumentEl()
const toolsSectionEl = strictSelect('#tools', appEl)
const viewportSectionEl = strictSelect('#viewport', appEl)

toolsSectionEl.append(toolsEl)
viewportSectionEl.append(documentEl)

document.body.append(appEl)

const state = createState()

state.mode('pan')
state.snap( { width: 2, height: 2 })
state.documentSize({ width: 1000, height: 1000 })

const actions = createActions(state)

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
