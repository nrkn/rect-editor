import { updateGridPattern } from '../els/grid-pattern'
import { strictSelect } from '../lib/dom/util'
import { createHandler } from '../lib/handlers/create-handler'

export const handleSnapGrid = () => {
  const snapWidthEl = strictSelect<HTMLInputElement>( '#snap-width' )
  const snapHeightEl = strictSelect<HTMLInputElement>( '#snap-width' )

  const onChange = () => {
    const width = snapWidthEl.valueAsNumber
    const height = snapHeightEl.valueAsNumber

    updateGridPattern({ width, height })
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
