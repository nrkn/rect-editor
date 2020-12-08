import { createActions } from './actions/create-actions'
import { createAppEls } from './els/app'
import { createDocumentEl } from './els/document'
import { createInfo } from './els/info'
import { createToolsEls } from './els/tools'
import { createHandlers, handleRedo, handleResetZoom, handleResize, handleUndo } from './handlers/create-handlers'
import { handleSnapGrid } from './handlers/handle-snap-grid'
import { getAllRects, getAppRects } from './handlers/util'
import { fieldset, form, input, label, legend, option, select } from './lib/dom/h'
import { line, rect } from './lib/dom/s'
import { attr, strictSelect } from './lib/dom/util'
import { positionNames, xPositionNames, yPositionNames } from './lib/geometry/consts'
import { flipRectInBounds, growSidesRectByDelta, rectToSidesRect, scaleRectFrom, scaleRectFromBounds, sidesRectToRect } from './lib/geometry/rect'
import { Rect, XPosition, YPosition } from './lib/geometry/types'
import { createState } from './state/create-state'

const appEl = createAppEls()
const toolsEl = createToolsEls()
const documentEl = createDocumentEl()
const infoEl = createInfo()

const toolsSectionEl = strictSelect('#tools', appEl)
const viewportSectionEl = strictSelect('#viewport', appEl)
const footerEl = strictSelect('footer', appEl)

footerEl.append(infoEl)
toolsSectionEl.append(toolsEl)
viewportSectionEl.append(documentEl)

document.body.append(appEl)

const state = createState()

state.mode('pan')
state.snap({ width: 25, height: 25 })
state.documentSize({ width: 1000, height: 1000 })

const actions = createActions(state)

handleResize(state)
handleResetZoom(actions)

handleUndo(actions)
handleRedo(actions)

handleSnapGrid()

actions.zoomToFit()

actions.rects.add(
  [
    { id: 'a', x: 250, y: 250, width: 250, height: 250, 'data-style': 'none' },
    { id: 'b', x: 500, y: 500, width: 250, height: 250, 'data-style': 'none' },
  ]
)

const rectsEl = strictSelect<SVGGElement>('#rects')

let boundsRect: Rect = { x: 250, y: 250, width: 500, height: 500 }

const boundsEl = rect({ stroke: 'red', fill: 'none'}, boundsRect)

rectsEl.before(
  line({ stroke: 'red', x1: 500, y1: 0, x2: 500, y2: 1000 }),
  line({ stroke: 'red', x1: 0, y1: 500, x2: 1000, y2: 500 }),
  boundsEl
)

const selectXOrigin = select(
  ...xPositionNames.map(s => option({ value: s }, s))
)

const selectYOrigin = select(
  ...yPositionNames.map(s => option({ value: s }, s))
)

const dxEl = input({ type: 'number', step: 1, value: 0 })
const dyEl = input({ type: 'number', step: 1, value: 0 })

const editScaleEl = fieldset(
  legend('Scale'),
  label('X Origin', selectXOrigin),
  label('Y Origin', selectYOrigin),
  label('dx', dxEl),
  label('dy', dyEl)
)

toolsEl.append(editScaleEl)

toolsEl.addEventListener('change', () => {
  const xOrigin = selectXOrigin.value as XPosition
  const yOrigin = selectYOrigin.value as YPosition

  const dx = dxEl.valueAsNumber * state.snap().width
  const dy = dyEl.valueAsNumber * state.snap().height

  const sidesRect = rectToSidesRect( boundsRect )

  const grown = growSidesRectByDelta( 
    sidesRect, { x: dx, y: dy }, [ xOrigin, yOrigin ] 
  )

  const newBoundsRect =  sidesRectToRect( grown )

  let flipX = false
  let flipY = false

  if( newBoundsRect.width < 0 ){
    flipX = true
    newBoundsRect.x += newBoundsRect.width * 2
    newBoundsRect.width *= -1
  }

  if( newBoundsRect.height < 0 ){
    flipY = true
    newBoundsRect.y += newBoundsRect.height * 2
    newBoundsRect.height *= -1
  }

  console.log( dx, dy, newBoundsRect )

  if( newBoundsRect.width === 0 || newBoundsRect.height === 0 ) return

  attr( boundsEl, newBoundsRect )
  
  const rectEls = getAllRects()
  const appRects = getAppRects( rectEls.map( el => el.id ) )

  appRects.forEach( appRect => {
    const el = strictSelect<SVGRectElement>( `#${ appRect.id }`)

    appRect = scaleRectFromBounds( appRect, boundsRect, newBoundsRect )
    appRect = flipRectInBounds( appRect, newBoundsRect, flipX, flipY )

    attr( el, appRect )
  })

  boundsRect = newBoundsRect
})

const stateSerialized = JSON.stringify(
  state,
  (_key, value) => {
    if (typeof value === 'function') return value()

    return value
  },
  2
)

console.log(stateSerialized)
