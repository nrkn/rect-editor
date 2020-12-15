import { strictSelect, strictFormRadioNodes } from '../lib/dom/util'
import { createHandler } from '../lib/handlers/create-handler'
import { Handler } from '../lib/handlers/types'
import { disableHandlers, enableHandlers } from '../lib/handlers/util'
import { State, AppMode } from '../types'

export const handleModeChange = ( state: State ) => {
  const toolsEl = strictSelect('#tools')
  const toolsFormEl = strictSelect('form', toolsEl)
  const modeRadioNodes = strictFormRadioNodes(toolsFormEl, 'mode')
  
  const change = () => {
    if( modeRadioNodes.value !== state.mode() ){
      state.mode( modeRadioNodes.value as AppMode )
    }
  }

  const enabler = () => {
    toolsFormEl.addEventListener( 'change', change )
  }

  const disabler = () => {
    toolsFormEl.removeEventListener( 'change', change )
  }

  return createHandler( 'mode-change', enabler, disabler )
}

const selectKeys = [
  'select-click',
  'select-drag',
  'select-move-drag',
  'select-resize-drag'
]

const drawKeys = [
  'draw-click',
  'draw-drag'
]

export const setMode = (handlers: Map<string, Handler>, mode: AppMode) => {
  const disableSelect = () => {
    disableHandlers(handlers, ...selectKeys)
  }

  const disableDraw = () => {
    disableHandlers(handlers, ...drawKeys)
  }

  const disablePick = () =>
    disableHandlers(handlers, 'pick-click')

  const disablePaint = () =>
    disableHandlers(handlers, 'paint-click')

  // all except pan
  const disableAll = () => {
    disableSelect()
    disableDraw()
    disablePick()
    disablePaint()
  }

  const modeHandlers: Record<AppMode, () => void> = {
    pan: disableAll,
    draw: () => {
      disableAll()
      enableHandlers(handlers, ...drawKeys)
    },
    select: () => {
      disableAll()
      enableHandlers(handlers, ...selectKeys)
    },
    pick: () => {
      disableAll()
      enableHandlers(handlers, 'pick-click')
    },
    paint: () => {
      disableAll()
      enableHandlers(handlers, 'paint-click')
    }
  }

  modeHandlers[mode]()
}