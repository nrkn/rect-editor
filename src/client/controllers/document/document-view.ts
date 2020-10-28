import { createGridBg } from '../../canvas/grid-bg/create-grid-bg'
import { getBoundingRect } from '../../geometry'
import { createDefsManager, DefsManager } from '../../lib/dom/defs'
import { getRectElRect } from '../../lib/dom/geometry'
import { svg, g, rect } from '../../lib/dom/s'
import { attr, strictSelect } from '../../lib/dom/util'
import { Rect, Size } from '../../lib/geometry/types'
import { SetStateRecord } from '../../lib/state/types'
import { View } from '../../lib/view/types'
import { createResizer } from './resizer'
import { DocumentElements, DocumentViewModel } from './types'

export const createDocumentView = () => {
  const svgEl = svg()
  const groupEl = g()
  const defsManager = createDefsManager(svgEl)
  const gridRectEl = rect({ class: 'grid', fill: 'pink' })

  svgEl.append(groupEl)
  groupEl.append(gridRectEl)

  const render: SetStateRecord<DocumentViewModel> = {
    createRects: rects => {
      rects.forEach(({ id, rect }) => {
        groupEl.append( createRectEl( id, rect ) )
      })
    },
    updateRects: rects => {
      rects.forEach(({ id, rect }) => {
        updateRectEl( groupEl, id, rect )
      })
    },
    removeRects: ids => {
      ids.forEach( id => removeRectEl( groupEl, id ) )
    },
    orderRects: ids => {
      ids.forEach( id => {
        const existing = getRectEl( groupEl, id )

        groupEl.append( existing )
      })
    },
    gridSize: size => {
      attr(gridRectEl, size)
    },
    cellSize: size => {
      updateGridBg(defsManager, gridRectEl, size)
    },
    selection: ids => {
      const currentResizer = groupEl.querySelector( '.resizer' )
      const currentlySelected = groupEl.querySelectorAll( '.selected' )
      const rectEls = ids.map( id => getRectEl( groupEl, id ) )
      const rects = rectEls.map( el => getRectElRect( el ) )
      const bounds = getBoundingRect( rects )

      if( currentResizer !== null ) currentResizer.remove()

      currentlySelected.forEach( el => el.classList.remove( 'selected' ) )
      rectEls.forEach( el => el.classList.add( 'selected' ) )

      if( bounds ){
        const resizeEl = createResizer( bounds )

        groupEl.append( resizeEl )
      }
    }
  }

  const elements: DocumentElements = { svgEl, groupEl, gridRectEl }

  const documentView: View<DocumentViewModel,DocumentElements> = { 
    render, elements 
  }

  return documentView
}

export const updateGridBg = (
  defsManager: DefsManager, gridRectEl: SVGRectElement, cellSize: Size
) => {
  const { width, height } = cellSize

  let gridBgCanvas = defsManager.get('gridBg')

  if (gridBgCanvas) {
    const { width: cw, height: ch } = gridBgCanvas

    if (width === cw && height === ch) return
  }

  gridBgCanvas = createGridBg(width, height)

  defsManager.setPattern('gridBg', gridBgCanvas)

  attr(gridRectEl, { fill: 'url(#gridBg)' })
}

const createRectEl = (id: string, { x, y, width, height }: Rect) =>
  rect({ id, class: 'rectEl', x, y, width, height })

const getRectEl = ( groupEl: SVGGElement, id: string ) =>
  strictSelect<SVGRectElement>( `#${ id }`, groupEl )

const updateRectEl = ( 
  groupEl: SVGGElement, id: string, rect: Rect 
) => 
  attr( getRectEl( groupEl, id ), rect )

const removeRectEl = (
  groupEl: SVGGElement, id: string
) => 
  getRectEl( groupEl, id ).remove()
