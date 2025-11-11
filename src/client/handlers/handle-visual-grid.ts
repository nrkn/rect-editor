import { strictSelect } from '../lib/dom/util'
import { createHandler } from '../lib/handlers/create-handler'
import { State } from '../types'

export const handleVisualGrid = ( state: State ) => {
  const gridWidthEl = strictSelect<HTMLInputElement>( '#grid-width' )
  const gridHeightEl = strictSelect<HTMLInputElement>( '#grid-height' )

  const onChange = () => {
    const width = gridWidthEl.valueAsNumber
    const height = gridHeightEl.valueAsNumber

    state.grid({ width, height })
  }  

  const enabler = () => {
    gridWidthEl.addEventListener( 'change', onChange )
    gridHeightEl.addEventListener( 'change', onChange )  
  }

  const disabler = () => {
    gridWidthEl.removeEventListener( 'change', onChange )
    gridHeightEl.removeEventListener( 'change', onChange )  
  }

  return createHandler( 'visual-grid', enabler, disabler )
}
