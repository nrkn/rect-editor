import { insideRect } from '../../geometry'
import { setRectElRect } from '../../lib/dom/geometry'
import { g, rect } from '../../lib/dom/s'

import { 
  findXPosition, findYPosition, getXPosition, getYPosition 
} from '../../lib/geometry/position'

import { 
  Point, Positions, Rect, XPosition, xPositionNames, YPosition, yPositionNames 
} from '../../lib/geometry/types'

const handleSize = 8

export const createResizer = ( 
  bounds: Rect
) => {
  const outlineEl = rect(
    { class: 'outline' }
  )

  const outlineRect = insideRect( bounds )

  setRectElRect( outlineEl, outlineRect )

  const groupEl = g(
    { class: 'resizer' },
    outlineEl,
    ...createHandles( bounds )
  )

  return groupEl
}

const createHandles = ( rect: Rect ) => {
  const handles: SVGRectElement[] = []

  yPositionNames.forEach(
    yName => {
      const y = getYPosition( rect, yName )
      xPositionNames.forEach(
        xName => {
          if( yName === 'yCenter' && xName === 'xCenter' ) return

          const x = getXPosition( rect, xName )

          const handle = createHandle( { x, y }, xName, yName )

          handles.push( handle )
        }
      )
    }
  )

  return handles
}

const createHandle = ( 
  { x, y }: Point, xName: XPosition, yName: YPosition
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
      class: [ 'handle', xName, yName ].join( ' ' )
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
