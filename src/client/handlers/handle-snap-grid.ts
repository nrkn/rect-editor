import { strictSelect } from '../lib/dom/util'
import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'

export const handleSnapGrid = ( state: State ) => {
  const snapWidthEl = strictSelect<HTMLInputElement>( '#snap-width' )
  const snapHeightEl = strictSelect<HTMLInputElement>( '#snap-height' )

  const onChange = () => {
    const width = snapWidthEl.valueAsNumber
    const height = snapHeightEl.valueAsNumber

    state.snap({ width, height })
  }  

  const enabler = () => {
    snapWidthEl.addEventListener( 'change', onChange )
    snapHeightEl.addEventListener( 'change', onChange )  
  }

  const disabler = () => {
    snapWidthEl.removeEventListener( 'change', onChange )
    snapHeightEl.removeEventListener( 'change', onChange )  
  }

  return createHandler( 'snap-grid', enabler, disabler )
}
