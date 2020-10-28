import { button, fieldset, legend, div, label, input, form } from '../../lib/dom/h'
import { strictFormElement, strictSelect } from '../../lib/dom/util'
import { SetStateRecord } from '../../lib/state/types'
import { appModes, AppMode, AppModel, AppActions } from '../app/types'
import { isAppMode } from '../app/util'
import { DocumentActions } from '../document/types'
import { ToolsModel } from './types'

export const createToolsView = (
  setAppState: SetStateRecord<AppModel>,
  appActions: AppActions,
  documentActions: DocumentActions
) => {
  const sectionEl = strictSelect<HTMLElement>( '#tools' )

  const formEl = form(
    ...createToolbar()
  )

  sectionEl.append( formEl )

  const modeEl = strictFormElement( formEl, 'mode' )
  const snapWidthEl = strictFormElement( formEl, 'cellWidth' )
  const snapHeightEl = strictFormElement( formEl, 'cellHeight' )

  const render: SetStateRecord<ToolsModel> = {
    appMode: mode => {
      modeEl.value = mode
    },
    snapSize: ({ width, height }) => {
      snapWidthEl.value = String( width )
      snapHeightEl.value = String( height )
    }
  } 

  formEl.addEventListener( 'change', () => {
    const mode = modeEl.value

    if( isAppMode( mode ) ){
      setAppState.appMode( mode )
    }

    const width = parseInt( snapWidthEl.value, 10 )
    const height = parseInt( snapHeightEl.value, 10 )

    setAppState.snapSize( { width, height } )    
  })

  const resetZoomButton = strictSelect<HTMLButtonElement>( 
    '#resetZoom', formEl 
  )

  resetZoomButton.addEventListener( 'click', () => {
    appActions.zoomToFit()
  })

  const undoButton  = strictSelect<HTMLButtonElement>( 
    '#undo', formEl 
  )

  const redoButton  = strictSelect<HTMLButtonElement>( 
    '#redo', formEl 
  )

  undoButton.addEventListener( 'click', () => {
    documentActions.undo()
  })

  redoButton.addEventListener( 'click', () => {
    documentActions.redo()
  })

  return render
}

const createToolbar = () => [
  ...createActionButtons(),
  createPointerModes(),
  createSizeEditor('Snap to Grid', 'cell')
]

const createActionButtons = () => {
  return [
    button({ type: 'button', id: 'undo' }, 'Undo'),
    button({ type: 'button', id: 'redo' }, 'Redo'),
    button({ type: 'button', id: 'resetZoom' }, 'Reset Zoom')
  ]
}

const createPointerModes = () =>
  fieldset(
    legend('Pointer Mode'),
    ...appModes.map(createPointerMode)
  )

const createPointerMode = (mode: AppMode) =>
  div(
    label(
      input({ name: 'mode', type: 'radio', value: mode, checked: '' }),
      ` ${mode}`
    )
  )

const createSizeEditor = (title: string, prefix: string) =>
  fieldset(
    legend(title),
    createIntegerEditor('Width', `${prefix}Width`),
    createIntegerEditor('Height', `${prefix}Height`),
  )

const createIntegerEditor = (
  title: string, name: string, step = 1, value = 1, min = 1
) =>
  div(
    label(
      title,
      input({ name, type: 'number', value, min, step })
    )
  )