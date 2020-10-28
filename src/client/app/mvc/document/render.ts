import { createDefsManager } from '../../../lib/dom/defs'
import { setViewBox } from '../../../lib/dom/geometry'
import { svg, g, rect } from '../../../lib/dom/s'
import { attr } from '../../../lib/dom/util'
import { createGridBg } from '../../image-generators/grid-bg'
import { AppOptions } from '../../types'

export const renderSvgRoot = (options: AppOptions) => {
  const { gridSize, cellSize } = options

  const gridRect = Object.assign({ x: 0, y: 0 }, gridSize)

  const svgEl = svg()

  setViewBox(svgEl, gridRect)

  const groupEl = g()

  svgEl.append(groupEl)

  const defsManager = createDefsManager(svgEl)

  const { width: cw, height: ch } = cellSize
  const gridBg = createGridBg(cw, ch)

  defsManager.setPattern('gridBg', gridBg)

  const gridRectEl = rect()

  groupEl.append(gridRectEl)

  attr(
    gridRectEl,
    gridRect,
    {
      fill: 'url(#gridBg)',
    }
  )

  return { svgEl, groupEl, gridRectEl, defsManager }
}
