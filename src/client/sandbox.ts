import { createAppEls } from './els/app'
import { createAppFromFeatures } from './features/create-app-from-features'
import { createAppEl } from './features/els/create-app-el'
import { createModalEl } from './features/els/create-modal-el'
import { featureApp, featureModal } from './features/features'
import { div, p } from './lib/dom/h'
import { noop } from './lib/util'

const appEl = createAppEl()
const modalEl = createModalEl()

const app = createAppFromFeatures(
  [featureApp, featureModal],
  [appEl, modalEl]
)

const rootNode = app.appEl?.el() || div()
const updateApp = app.appEl?.update || noop

document.body.append(rootNode)

updateApp(
  {
    titleHTML: 'Create App',
  }
)

if (modalEl.update) {
  modalEl.update({ contents: p('Hello'), visible: true })
}
