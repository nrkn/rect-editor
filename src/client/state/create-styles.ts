import { createSequence } from '../lib/util'
import { AppStyle } from '../types'

const numHues = 25
const deg = 360 / numHues

let styleIndex = 0

const newIndex = () => {
  const current = styleIndex

  styleIndex++

  return current
}

export const createStyles = () => {
  const createAppStyle = (prefix: string) => (color: string) => {
    const style: AppStyle = {
      id: `${prefix}-${newIndex()}`,
      type: prefix,
      data: color
    }

    return style
  }

  const greyToAppStyle = createAppStyle('grey')
  const hueToAppStyle = createAppStyle('hue')

  const appStyles: AppStyle[] = [
    ...grays.map(greyToAppStyle),
    ...hues.map(hueToAppStyle)
  ]  

  return appStyles
}

export const styleToFill = ( style: AppStyle, defaultOpacity: number ) => {
  if( style.type === 'grey' ){
    const { data } = style

    return `rgba(${ data },${ data },${ data },${ defaultOpacity })`
  }

  if( style.type === 'hue' ){
    const { data } = style

    return `hsla(${ data },100%,50%,${ defaultOpacity })`
  }
}

const hues = createSequence(
  numHues,
  i => String( Math.floor(i * deg) )
)

const grays = createSequence(
  5,
  i => String( 255 - (i * 32) )
)
