import { g, rect } from '../../lib/dom/s'
import { setRectElRect } from '../actions'
import { insideRect } from '../geometry'

import { 
  findXPosition, findYPosition, getXPosition, getYPosition 
} from '../../lib/geometry/position'

import { 
  Point, Positions, Rect, XPosition, xPositionNames, YPosition, yPositionNames 
} from '../../lib/geometry/types'

import { handleSize } from '../consts'

export const createResizer = ( 
  bounds: Rect, rectId: string 
) => {
  const outlineEl = rect(
    { class: 'outline', 'data-id': rectId }
  )

  const outlineRect = insideRect( bounds )

  setRectElRect( outlineEl, outlineRect )

  const groupEl = g(
    { class: 'resizer', 'data-id': rectId },
    outlineEl,
    ...createHandles( bounds, rectId )
  )

  return groupEl
}

const createHandles = ( rect: Rect, rectId: string ) => {
  const handles: SVGRectElement[] = []

  yPositionNames.forEach(
    yName => {
      const y = getYPosition( rect, yName )
      xPositionNames.forEach(
        xName => {
          if( yName === 'yCenter' && xName === 'xCenter' ) return

          const x = getXPosition( rect, xName )

          const handle = createHandle( { x, y }, xName, yName, rectId )

          handles.push( handle )
        }
      )
    }
  )

  return handles
}

const createHandle = ( 
  { x, y }: Point, xName: XPosition, yName: YPosition, rectId: string
) => { 
  const width = handleSize
  const height = handleSize

  x -= width / 2 
  y -= height / 2

  switch( xName ){
    case 'left': x += 1
    case 'right': x -= 0.5
  }

  switch( yName ){
    case 'top': y += 1
    case 'bottom': y -= 0.5
  }

  const handleEl = rect(
    { 
      class: [ 'handle', xName, yName ].join( ' ' ),
      'data-id': rectId
    }
  )
  
  setRectElRect( handleEl, { x, y, width, height } )

  return handleEl
}

export const getHandlePositions = ( handleEl: SVGRectElement ) => {
  const classes = [ ...handleEl.classList ]

  if( !classes.includes( 'handle' ) ) 
    throw Error( 'Expected element classes to include handle' )

  const xPosition = findXPosition( classes )

  if( xPosition === undefined ) 
    throw Error( 
      `Expected element to include one of ${ xPositionNames.join( ', ' ) }`
    )

  const yPosition = findYPosition( classes )

  if( yPosition === undefined ) 
    throw Error( 
      `Expected element to include one of ${ yPositionNames.join( ', ' ) }`
    )
  
  const positions: Positions = [ xPosition, yPosition ]

  return positions
}
