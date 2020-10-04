import { strictFormElement } from '../lib/dom/util'
import { transformRelativeTo } from '../lib/geometry/transform'
import { Transform } from '../lib/geometry/types'
import { applyTransform } from './geometry'
import { getDrawRects } from './rects'
import { AppMode, AppState } from './types'

export const selectNone = (state: AppState) => {
  const rectEls = getDrawRects(state)

  rectEls.forEach(rectEl => rectEl.classList.remove('selected'))
}

export const selectRect = ( _state: AppState, rectEl: SVGRectElement ) => {
  rectEl.classList.add( 'selected' )
}

export const getSelection = ( state: AppState ) => {
  const rectEls = getDrawRects( state )

  return rectEls.filter( el => el.classList.contains( 'selected' ) )
}

const changeEvent = new Event('change')

export const switchMode = (state: AppState, mode: AppMode) => {
  const { formEl } = state.dom

  const modeEl = strictFormElement(formEl, 'mode')

  modeEl.value = mode

  formEl.dispatchEvent(changeEvent)
}

export const zoomAt = ( state: AppState, { scale, x, y }: Transform ) => {
  const { options } = state
  const { minScale } = options

  if( scale < minScale ) scale = minScale
  
  const newTransform = transformRelativeTo(
    state.transform, scale, { x, y }
  )

  Object.assign(state.transform, newTransform)

  applyTransform(state)
}