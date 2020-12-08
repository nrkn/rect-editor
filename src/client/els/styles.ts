import { fieldset, input, label, legend } from '../lib/dom/h'
import { attr } from '../lib/dom/util'
import { createSequence } from '../lib/util'

const defaultOpacity = 0.75
const numHues = 25
const deg = 360 / numHues

export const createStyles = () => {
  const stylesEl = fieldset(
    { id: 'styles' },
    legend( 'Styles'),
    createFillStyle( `rgba(255,255,255,${ defaultOpacity })`, true ),
    createFillStyle( `rgba(191,191,191,${ defaultOpacity })`),
    createFillStyle( `rgba(127,127,127,${ defaultOpacity })`),
    createFillStyle( `rgba(63,63,63,${ defaultOpacity })`),
    createFillStyle( `rgba(0,0,0,${ defaultOpacity })`),
    ...hslas.map( s => createFillStyle( s ) )
  )  

  return stylesEl
}

const degs = createSequence( 
  numHues, 
  i =>  `${ Math.floor( i * deg ) }deg`
)

const hslas = degs.map( deg => `hsla(${ deg },100%,50%,${ defaultOpacity })`)

const createFillStyle = ( color: string, checked = false ) => {
  const radioEl = input(
    { 
      type: 'radio',
      name: 'fill', 
      value: `color ${ color }` 
    }
  )

  if( checked ){
    attr( radioEl, { checked: '' } )
  }  

  const labelEl = label(
    { class: 'style-radio-label', style: `background: ${ color }` },
    radioEl
  )

  return labelEl
}
