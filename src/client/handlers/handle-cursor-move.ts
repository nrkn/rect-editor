import { handleSize } from '../consts'
import { CursorStates } from '../lib/dom/types'
import { getKeys, strictSelect } from '../lib/dom/util'
import { getEdgePositions } from '../lib/geometry/position'
import { stringRectToRect } from '../lib/geometry/rect'
import { Point, Positions, StringRect } from '../lib/geometry/types'
import { State } from '../types'
import { createTranslatePoint } from './util'
import { getPosition } from '../lib/handlers/util'
import { createHandler } from '../lib/handlers/create-handler'

export const handleCursorMove = ( 
  state: State,
  transformPoint = createTranslatePoint( state ) 
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const positionXEl = strictSelect<HTMLInputElement>('#positionX')
  const positionYEl = strictSelect<HTMLInputElement>('#positionY')
  
  const cursorMove = ( e: MouseEvent ) => {
    const bounds = viewportEl.getBoundingClientRect()

    const current = transformPoint( getPosition( e, bounds ) )

    positionXEl.value = String( Math.floor( current.x ) ).padStart( 6 )
    positionYEl.value = String( Math.floor( current.y ) ).padStart( 6 )

    if( state.mode() === 'select' ){
      handleSelectMove( state, current, viewportEl )
    }
  }

  const enabler = () => {   
    viewportEl.addEventListener( 'mousemove', cursorMove )
  }

  const disabler = () => {
    viewportEl.removeEventListener( 'mousemove', cursorMove )
  }

  return createHandler( 'cursor-move', enabler, disabler )
}

const handleSelectMove = ( 
  state: State, point: Point, viewportEl: HTMLElement 
) => {
  viewportEl.style.cursor = 'default'

  const resizerEl = document.querySelector<SVGGElement>( '#resizer' )

  if( resizerEl === null ) return

  const stringRect = resizerEl.dataset as StringRect
  const rect = stringRectToRect( stringRect )

  const positions = getEdgePositions( rect, handleSize, point )

  if( positions === undefined ) return

  const cursor = getKeys( cursorPredicates ).find( 
    key => cursorPredicates[ key ]( state, positions )
  )

  if( cursor === undefined ) return

  viewportEl.style.cursor = cursor
}

type CursorPredicate = ( state: State, positions: Positions ) => boolean

const cursorPredicates: Record<CursorStates,CursorPredicate> = {
  'ew-resize': ( _state, [ xPosition, yPosition ]: Positions ) => {
    if( yPosition !== 'yCenter' ) return false

    return xPosition === 'left' || xPosition === 'right'
  },
  'ns-resize': ( _state, [ xPosition, yPosition ]: Positions ) => {
    if( xPosition !== 'xCenter' ) return false

    return yPosition === 'top' || yPosition === 'bottom'
  },
  'nesw-resize': ( _state, [ xPosition, yPosition ]: Positions ) => {
    if( xPosition === 'right' && yPosition === 'top' ) return true
    if( xPosition === 'left' && yPosition === 'bottom' ) return true

    return false
  },
  'nwse-resize': ( _state, [ xPosition, yPosition ]: Positions ) => {
    if( xPosition === 'right' && yPosition === 'bottom' ) return true
    if( xPosition === 'left' && yPosition === 'top' ) return true

    return false
  },
  'move': ( state, [ xPosition, yPosition ]: Positions ) => {
    if( state.mode() !== 'select' ) return false
    if( xPosition === 'xCenter' && yPosition === 'yCenter' ) return true    

    return false
  }
}