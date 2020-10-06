import { g, rect } from '../../lib/dom/s'
import { getXPosition, getYPosition } from '../../lib/geometry/position'
import { setRectElRect } from '../actions'
import { insideRect } from '../geometry'

import { 
  Point, Rect, XPosition, xPositionNames, YPosition, yPositionNames 
} from '../../lib/geometry/types'

export const createResizer = ( 
  bounds: Rect, rectId: string 
) => {
  const outlineEl = rect(
    { class: 'outline' }
  )

  const outlineRect = insideRect( bounds )

  setRectElRect( outlineEl, outlineRect )

  const groupEl = g(
    { class: 'resize', 'data-for': rectId },
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

const createHandle = ( { x, y }: Point, xName: XPosition, yName: YPosition ) => {
  const width = 4
  const height = 4
  
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
    { class: [ 'handle', xName, yName ].join( ' ' ) }
  )
  
  setRectElRect( handleEl, { x, y, width, height } )

  return handleEl
}
