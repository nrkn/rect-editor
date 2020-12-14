import { updateClickEl } from '../../els/info-click'
import { strictSelect } from '../../lib/dom/util'
import { handleClick } from '../../lib/handlers/handle-click'
import { ClickPredicate, HandleClickOptions, OnHandleClick } from '../../lib/handlers/types'
import { State } from '../../types'
import { createTranslatePoint } from '../util'

export const handleAppClick = (
  name: string,
  state: State,
  click: OnHandleClick,
  predicate: ClickPredicate,
  opts?: Partial<HandleClickOptions>
) => {
  const defaultOptions: Partial<HandleClickOptions> = {
    transformPoint: createTranslatePoint(state)
  }

  const options = Object.assign(
    {}, defaultOptions, opts, { predicate }
  )

  const viewportEl = strictSelect<HTMLElement>('#viewport')
  
  const onAppClick: OnHandleClick = ( point, button, e ) => {
    click( point, button, e )

    updateClickEl( point, name )
  }
  
  return handleClick( name, viewportEl, onAppClick, options )
}
