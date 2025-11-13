import { insideRect, rectToStringRect } from '../lib/geometry/rect'
import { rect, g } from '../lib/dom/s'
import { setRectElRect, strictSelect } from '../lib/dom/util'
import { yPositionNames, xPositionNames } from '../lib/geometry/consts'
import { Rect, Point, XPosition, YPosition } from '../lib/geometry/types'
import { getYPosition, getXPosition} from '../lib/geometry/position'

export const createResizer = ( 
  bounds: Rect, handleSize: number
) => {
  const outlineEl = rect(
    { id: 'outline', stroke: 'rgba(64, 128, 255, 1)', fill: 'none' }
  )

  const groupEl = g(
    { id: 'resizer' },
    outlineEl,
    ...createHandles()
  )

  updateResizer( bounds, handleSize, groupEl )

  return groupEl
}

const createHandles = () => {
  const handles: SVGRectElement[] = []

  yPositionNames.forEach(
    yName => {
      xPositionNames.forEach(
        xName => {
          if( yName === 'yCenter' && xName === 'xCenter' ) return

          const handle = createHandle( xName, yName )

          handles.push( handle )
        }
      )
    }
  )

  return handles
}

const createHandle = ( 
  xName: XPosition, yName: YPosition
) => { 
  const handleEl = rect(
    { 
      class: [ 'handle', xName, yName ].join( ' ' ),
      stroke: 'rgba(64, 128, 255, 1)',
      fill: 'rgba( 255, 255, 255, 0.75 )'
    }
  )

  return handleEl
}

export const updateResizer = ( 
  bounds: Rect, handleSize: number, 
  groupEl: SVGGElement = strictSelect<SVGGElement>( '#resizer' )
) => {
  const outlineEl = strictSelect<SVGRectElement>( '#outline', groupEl )
  const outlineRect = insideRect( bounds )

  Object.assign( groupEl.dataset, rectToStringRect( bounds ) )
  setRectElRect( outlineEl, outlineRect )
  updateHandles( groupEl, bounds, handleSize )
}

const updateHandles = ( 
  groupEl: SVGGElement, bounds: Rect, handleSize: number 
) => {
  yPositionNames.forEach(
    yName => {
      const y = getYPosition( bounds, yName )
      xPositionNames.forEach(
        xName => {
          if( yName === 'yCenter' && xName === 'xCenter' ) return

          const x = getXPosition( bounds, xName )

          const handleEl = strictSelect<SVGRectElement>( 
            `.handle.${ xName }.${ yName }`, groupEl
          ) 

          updateHandle( handleEl, { x, y }, xName, yName, handleSize )
        }
      )
    }
  )
}

const updateHandle = (
  handleEl: SVGRectElement, 
  { x, y }: Point, xName: XPosition, yName: YPosition, handleSize: number
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
  
  setRectElRect( handleEl, { x, y, width, height } )
}
