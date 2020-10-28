import { applyTransform } from '../../geometry'
import { setViewBox } from '../../lib/dom/geometry'
import { strictSelect } from '../../lib/dom/util'
import { SetStateRecord } from '../../lib/state/types'
import { View } from '../../lib/view/types'
import { DocumentElements } from '../document/types'
import { AppElements, AppModel, AppOptions } from './types'

export const createAppView = (
  options: AppOptions & { elements: DocumentElements }
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  const { svgEl, groupEl } = options.elements

  viewportEl.append(svgEl)

  const render: SetStateRecord<AppModel> = {
    appMode: () => {
      // does nothing, passed to tools-view
    },
    snapSize: () => {
      // does nothing, passed to tools-view
    },
    viewportSize: ({ width, height }) => {
      setViewBox(svgEl, { x: 0, y: 0, width, height })
    },
    viewportTransform: transform => {
      applyTransform(groupEl, transform, options.minScale)
    }
  }

  const elements: AppElements = { viewportEl }

  const appView: View<AppModel,AppElements> = { render, elements }

  return appView
}
