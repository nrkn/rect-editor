import { strictSelect } from '../../lib/dom/util'
import { createPointerEmitter } from '../../lib/events/pointer-emitter'
import { Listener, PointerEmitterEvent } from '../../lib/events/types'
import { ClickPredicate, HandleClickOptions, Handler, OnHandleClick } from '../../lib/handlers/types'
import { State } from '../../types'
import { createTranslatePoint } from '../util'

export const handleAppClick = (
  name: string,
  state: State,
  click: OnHandleClick,
  predicate: ClickPredicate,
  opts?: Partial<HandleClickOptions>
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')
  const emitter = createPointerEmitter(viewportEl)
  const transformPoint = createTranslatePoint(state)
  const options = Object.assign( {}, opts, { predicate } )
  let active = false

  predicate = options.predicate

  const clickListener: Listener<PointerEmitterEvent> = e => {
    let { position, button, mouseEvent } = e

    position = transformPoint(position)

    if (!predicate(position, button, mouseEvent)) return

    click(position, button, mouseEvent)
  }
  
  const handler: Handler = {
    name: () => name,
    enable: () => {
      active = true
      emitter.tap.on( clickListener )
    },
    disable: () => {
      active = false
      emitter.tap.off( clickListener )
    },
    isActive: () => active
  }

  return handler
}
