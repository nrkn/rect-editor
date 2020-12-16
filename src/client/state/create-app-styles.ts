import { createNumericIndex, createSequence } from '../lib/util'
import { AppStyle } from '../types'

const numHues = 18
const numGreys = 6

const deg = Math.floor( 360 / numHues )
const value = Math.floor( 255 / numGreys )

export const createAppStyles = () => {
  const createIndex = createNumericIndex()

  const createAppStyle = (prefix: string) => (color: string) => {
    const style: AppStyle = {
      id: `${prefix}-${createIndex( prefix )}`,
      type: prefix,
      data: color
    }

    return style
  }

  const greyToAppStyle = createAppStyle('grey')
  const hueToAppStyle = createAppStyle('hue')

  const appStyles: AppStyle[] = [
    ...greys.map(greyToAppStyle),
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

const greys = createSequence(
  numGreys,
  i => String( 255 - i * value )
)
