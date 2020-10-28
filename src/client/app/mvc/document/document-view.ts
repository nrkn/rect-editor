import { setViewBox, transformToSvg } from '../../../lib/dom/geometry'
import { attr, strictSelect } from '../../../lib/dom/util'
import { Rect, Size, Transform } from '../../../lib/geometry/types'
import { createRectEl, setRectElRect } from '../../dom/rects'
import { AppOptions } from '../../types'
import { renderSvgRoot } from './render'
import { DocumentView, RectElement } from './types'

export const createDocumentView = <TRect extends Rect = Rect>(
  options: AppOptions
) => {
  const { svgEl, groupEl } = renderSvgRoot(options)

  const render = () => svgEl

  const create = (...elements: RectElement<TRect>[]) =>
    elements.forEach(
      ({ id, rect }) => groupEl.append(createRectEl(id, rect))
    )

  const update = (...elements: RectElement<TRect>[]) =>
    elements.forEach(
      ({ id, rect }) => setRectElRect(getRect(id), rect)
    )

  const remove = (...ids: string[]) =>
    ids.forEach(id => getRect(id).remove())

  const getRect = (id: string) =>
    strictSelect<SVGRectElement>(`#${id}`, groupEl)

  const setViewSize = ( { width, height }: Size) => 
    setViewBox(svgEl, { x: 0, y: 0, width, height })

  const setTransform = ( transform: Transform ) => {
    ensureMinScale( transform, options.minScale )
    attr(groupEl, { transform: transformToSvg(transform) })
  }

  const view: DocumentView<TRect> = {
    render, create, update, remove, setViewSize, setTransform
  }

  return view
}

const ensureMinScale = ( transform: Transform, minScale: number ) => { 
  if( transform.scale < minScale ) transform.scale = minScale
}
