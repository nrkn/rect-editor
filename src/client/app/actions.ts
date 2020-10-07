import { rect } from '../lib/dom/s'
import { strictFormElement, strictSelect } from '../lib/dom/util'
import { transformRelativeTo } from '../lib/geometry/transform'
import { Rect, Transform } from '../lib/geometry/types'
import { randomId } from '../lib/util'
import { createResizer } from './dom/resizer'
import { applyTransform, svgRectToRect } from './geometry'
import { getDrawRects } from './rects'
import { Action, ActionElement, ActionHandlerMap, AppMode, AppState, EditActionElement } from './types'

export const selectNone = (state: AppState) => {
  const rectEls = getDrawRects(state)

  rectEls.forEach(rectEl => rectEl.classList.remove('selected'))

  const resizeEls = state.dom.groupEl.querySelectorAll( '.resize' )

  resizeEls.forEach( el => el.remove() )
}

export const selectRect = ( state: AppState, rectEl: SVGRectElement ) => {
  rectEl.classList.add( 'selected' )

  const rect = svgRectToRect( rectEl )

  const resizeEl = createResizer( rect, rectEl.id )

  state.dom.groupEl.append( resizeEl )
}

export const isSelected = ( rectEl: SVGRectElement ) =>
  rectEl.classList.contains( 'selected' )

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
  newRect: Partial<Rect> = {}
) => {
  const initialRect = svgRectToRect( rectEl )

  const { x, y, width, height } = Object.assign(
    {}, initialRect, newRect
  )

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

  selectNone( state )
}

export const redoAction = ( state: AppState ) => {
  const { actions } = state
  const { list, nextIndex } = actions

  if( list.length === 0 || nextIndex === list.length ) return

  const action = list[ actions.nextIndex ]

  // wtf how to do this?
  redoActions[ action.type ]( state, action as any )

  actions.nextIndex++

  selectNone( state )
}

const actionAdd = ( state: AppState, { id, rect }: ActionElement ) => {
  const rectEl = createRectEl( id, rect )

  /* 
    TODO - how to put it back in the right place in the dom list? Keep track 
    of previous/next siblings? 
  */

  state.dom.groupEl.append( rectEl )
}

const actionDelete = ( state: AppState, { id }: ActionElement ) => {
  const rectEl = strictSelect( `#${ id }`, state.dom.groupEl )

  rectEl.remove()  
}

const actionEdit = ( state: AppState, id: string, rect: Rect ) => {
  const rectEl = strictSelect<SVGRectElement>( 
    `#${ id }`, state.dom.groupEl 
  )

  setRectElRect( rectEl, rect )
}

const addElements = ( state: AppState, elements: ActionElement[] ) => 
  elements.forEach( el => actionAdd( state, el ) )

  const deleteElements = ( state: AppState, elements: ActionElement[] ) =>
  elements.forEach( el => actionDelete( state, el ) )

const editElementsUndo = ( state: AppState, elements: EditActionElement[] ) =>
  elements.forEach( el => actionEdit( state, el.id, el.previous ) )

const editElementsRedo = ( state: AppState, elements: EditActionElement[] ) =>
  elements.forEach( el => actionEdit( state, el.id, el.rect ) )

const redoActions: ActionHandlerMap = {
  add: ( state, action ) => addElements( state, action.elements ),
  delete: ( state, action ) => deleteElements( state, action.elements ),
  edit: ( state, action ) => editElementsRedo( state, action.elements )
}

const undoActions: ActionHandlerMap = {
  add: ( state, action ) => deleteElements( state, action.elements ),
  delete: ( state, action ) => addElements( state, action.elements ),
  edit: ( state, action ) => editElementsUndo( state, action.elements )
}
