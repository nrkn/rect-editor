import { defs, image, pattern } from './s'
import { strictSelect } from './util'

const patternUnits = 'userSpaceOnUse'

export const createDefsManager = (svgEl: SVGSVGElement) => {
  const defsEl = defs()

  svgEl.append(defsEl)

  const canvases = new Map<string,HTMLCanvasElement>()

  const setPattern = (id: string, canvas: HTMLCanvasElement ) => {
    if (canvases.has(id)) {
      const pattern = strictSelect(`#${id}`, defsEl)

      pattern.remove()
    }

    const { width, height } = canvas
    const dataUrl = canvas.toDataURL()

    const imageEl = image({ href: `${dataUrl}`, x: 0, y: 0, width, height })

    imageEl.style.imageRendering = 'crisp-edges'

    const patternEl = pattern(
      { id, patternUnits, width, height }, 
      imageEl
    )

    defsEl.append(patternEl)

    canvases.set( id, canvas )
  }

  const get = ( id: string ) => canvases.get( id )

  const getNames = () => [...canvases.keys()]

  const manager: DefsManager = { getNames, setPattern, get }

  return manager
}

export type DefsManager = {
  getNames: () => string[]
  setPattern: (id: string, canvas: HTMLCanvasElement ) => void
  get: ( id: string ) => HTMLCanvasElement | undefined
}
