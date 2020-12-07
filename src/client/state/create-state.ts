import { minScale } from '../consts'
import { updateGridPattern } from '../els/grid-pattern'
import { attr, strictFormRadioNodes, strictSelect } from '../lib/dom/util'
import { ScaleTransform, Size } from '../lib/geometry/types'
import { AppMode, State } from '../types'

export const createState = () => {
  const mode = createMode()
  const snap = createSnapToGrid()
  const viewSize = createViewSize()
  const viewTransform = createViewTransform()
  const documentSize = createDocumentSize()
  const keys: Record<string,boolean> = {}

  const state: State = { 
    mode, snap, viewSize, viewTransform, documentSize, keys 
  }

  return state
}

const createMode = () => {
  const toolsEl = strictSelect('#tools')
  const toolsFormEl = strictSelect('form', toolsEl)
  const modeRadioNodes = strictFormRadioNodes(toolsFormEl, 'mode')

  const mode = (value?: AppMode) => {
    if (value !== undefined) {
      modeRadioNodes.value = value
    }

    return modeRadioNodes.value as AppMode
  }

  return mode
}

const createSnapToGrid = () => {
  const widthInputEl = strictSelect<HTMLInputElement>('#snap-width')
  const heightInputEl = strictSelect<HTMLInputElement>('#snap-height')

  const snapSize = ( value?: Size ) => {
    if( value !== undefined ){
      const { width, height } = value
      
      widthInputEl.valueAsNumber = width
      heightInputEl.valueAsNumber = height

      updateGridPattern( value )
    }

    const width = widthInputEl.valueAsNumber
    const height = heightInputEl.valueAsNumber

    return { width, height }
  }

  return snapSize
}

const createViewSize = () => {
  const svgEl = strictSelect<SVGSVGElement>('#document')

  let size: Size = { width: 0, height: 0 }

  const viewSize = (value?: Size) => {
    if (value !== undefined) {
      size = value

      const { width, height } = size

      attr(svgEl, { viewBox: `0 0 ${width} ${height}` })
    }

    const { width, height } = size
    
    return { width, height }
  }

  return viewSize
}

const createDocumentSize = () => {
  const gridEl = strictSelect<SVGRectElement>('#grid')

  let size: Size = { width: 0, height: 0 }

  const documentSize = (value?: Size) => {
    if (value !== undefined) {
      size = value

      const { width, height } = size

      attr(gridEl, { x: 0, y: 0, width, height })
    }

    const { width, height } = size
    
    return { width, height }
  }

  return documentSize
}

const createViewTransform = () => {
  let scaleTransform: ScaleTransform = { x: 0, y: 0, scale: 1 }

  const viewTransform = (value?: ScaleTransform) => {
    if (value !== undefined) {
      scaleTransform = value

      const { x, y, scale: transformScale } = scaleTransform

      const scale = Math.max(transformScale, minScale)

      const bodyEl = strictSelect<SVGGElement>('#body')

      attr(bodyEl, { transform: `translate(${x} ${y}) scale(${scale})` })
    }

    const { x, y, scale } = scaleTransform

    return { x, y, scale }
  }

  return viewTransform
}