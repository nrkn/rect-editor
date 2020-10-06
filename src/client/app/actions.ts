import { rect } from '../lib/dom/s'
import { strictFormElement, strictSelect } from '../lib/dom/util'
import { transformRelativeTo } from '../lib/geometry/transform'
import { Point, Rect, Size, Transform } from '../lib/geometry/types'
import { randomId } from '../lib/util'
import { createResizer } from './dom/resizer'
import { applyTransform, svgRectToRect } from './geometry'
import { getDrawRects } from './rects'
import { Action, ActionHandlerMap, ActionType, ActionTypeMap, AppMode, AppState, EditAction } from './types'

export const selectNone = (state: AppState) => {
  const rectEls = getDrawRects(state)

  rectEls.forEach(rectEl => rectEl.classList.remove('selected'))

  const resizeEls = state.dom.groupEl.querySelectorAll( '.resize' )

  resizeEls.forEach( el => el.remove() )
}

export const selectRect = ( _state: AppState, rectEl: SVGRectElement ) => {
  rectEl.classList.add( 'selected' )

  const rect = svgRectToRect( rectEl )

  const resizeEl = createResizer( rect, rectEl.id )

  rectEl.after( resizeEl )
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

export const setRectElRect = ( 
  rectEl: SVGRectElement,
  { x = 0, y = 0, width = 1, height = 1 }: Partial<Rect> = {}
) => {
  rectEl.x.baseVal.value = x
  rectEl.y.baseVal.value = y
  rectEl.width.baseVal.value = width
  rectEl.height.baseVal.value = height
}

export const createRectEl = (
  id = randomId(), 
  { x = 0, y = 0, width = 1, height = 1 }: Partial<Rect> = {}
) => {
  const rectEl = rect({
    id,
    class: 'draw-rect',
    fill: 'rgba( 255, 255, 255, 0.75 )'
  })

  setRectElRect( rectEl, { x, y, width, height } )

  return rectEl
}

export const newAction = ( state: AppState, action: Action ) => {
  const { actions } = state
  const { nextIndex } = actions

  actions.list = [ ...actions.list.slice( 0, nextIndex ), action ]
  actions.nextIndex = actions.list.length
}

export const undoAction = ( state: AppState ) => {
  const { actions } = state
  const { list } = actions

  if( list.length === 0 ) return

  const action = list[ actions.nextIndex - 1 ]

  // wtf how to do this?
  undoActions[ action.type ]( state, action as any )

  actions.nextIndex--
}

export const redoAction = ( state: AppState ) => {
  const { actions } = state
  const { list, nextIndex } = actions

  if( list.length === 0 || nextIndex === list.length ) return

  const action = list[ actions.nextIndex ]

  // wtf how to do this?
  redoActions[ action.type ]( state, action as any )

  actions.nextIndex++
}

const actionAdd = ( state: AppState, { id, rect }: Action ) => {
  const rectEl = createRectEl( id, rect )

  /* 
    TODO - how to put it back in the right place in the dom list? Keep track 
    of previous/next siblings? 
  */

  state.dom.groupEl.append( rectEl )
}

const actionDelete = ( state: AppState, { id  }: Action ) => {
  const rectEl = strictSelect( `#${ id }`, state.dom.groupEl )

  rectEl.remove()  
}

const actionEdit = ( state: AppState, id: string, rect: Rect ) => {
  const rectEl = strictSelect<SVGRectElement>( 
    `#${ id }`, state.dom.groupEl 
  )

  setRectElRect( rectEl, rect )
}

const redoActions: ActionHandlerMap = {
  add: actionAdd,
  delete: actionDelete,
  edit: ( state, { id, rect } ) => actionEdit( state, id, rect )
}

const undoActions: ActionHandlerMap = {
  add: actionDelete,
  delete: actionAdd,
  edit: ( state, { id, previous } ) => actionEdit( state, id, previous )
}
