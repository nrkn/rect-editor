import { fitAndPosition } from 'object-fit-math'
import { image, pattern } from '../lib/dom/s'
import { strictSelect, attr } from '../lib/dom/util'
import { Size } from '../lib/geometry/types'
import { BackgroundImage } from '../types'

export const createBackgroundImagePattern = () =>
  pattern(
    { id: 'backgroundImagePattern', patternUnits: "userSpaceOnUse" },
    image()
  )

export const updateBackgroundImagePattern = (
  documentSize: Size,
  backgroundImage: BackgroundImage,
  backgroundImagePatternEl: SVGPatternElement = (
    strictSelect<SVGPatternElement>('#backgroundImagePattern')
  )
) => {
  const imageEl = strictSelect( 'image', backgroundImagePatternEl )

  const { image } = backgroundImage
  const { src: href } = image

  const fitData = fitAndPosition( documentSize, image, 'contain' )

  attr( backgroundImagePatternEl, { x: 0, y: 0 }, documentSize )

  attr( imageEl, fitData, { href } )
}
