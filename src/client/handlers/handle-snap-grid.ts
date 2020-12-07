import { updateGridPattern } from '../els/grid-pattern'
import { strictSelect } from '../lib/dom/util'

export const handleSnapGrid = () => {
  const snapWidthEl = strictSelect<HTMLInputElement>( '#snap-width' )
  const snapHeightEl = strictSelect<HTMLInputElement>( '#snap-width' )

  const onChange = () => {
    const width = snapWidthEl.valueAsNumber
    const height = snapHeightEl.valueAsNumber

    updateGridPattern({ width, height })
  }  

  snapWidthEl.addEventListener( 'change', onChange )
  snapHeightEl.addEventListener( 'change', onChange )
}
