import { fitAndPosition } from 'object-fit-math'
import { strictSelect } from '../../../lib/dom/util'
import { createEmitter } from '../../../lib/events'
import { TypedEventEmitter } from '../../../lib/events/types'
import { Rect, Size, Transform } from '../../../lib/geometry/types'
import { createToolbar } from '../../dom/form-tools'
import { AppOptions } from '../../types'
import { DocumentView } from '../document/types'

export const createAppView = <TRect extends Rect = Rect>( 
  options: AppOptions,
  documentView: DocumentView<TRect>
) => {
  const viewportEl = strictSelect( '#viewport' )
  const toolsEl = strictSelect( '#tools' )

  const render = () => {
    viewportEl.append( documentView.render() )
    toolsEl.append( ...createToolbar() )

    initResize( viewportEl, events.viewSize )
    zoomToFit()
  }

  const zoomToFit = () => {
    const viewSize = getViewSize( viewportEl )

    const { x: fx, y: fy, width: fw } = fitAndPosition(
      viewSize, options.gridSize, 'contain', '50%', '50%'
    )
  
    const scale = fw / options.gridSize.width
    const x = fx / scale
    const y = fy / scale

    events.transform.emit({ x, y, scale })
  }

  const events = {
    viewSize: createEmitter<Size>(),
    transform: createEmitter<Transform>()
  }

  return { render, events }
}

const getViewSize = ( viewportEl: Element ): Size => 
  viewportEl.getBoundingClientRect()

const initResize = ( 
  viewportEl: Element, emitter: TypedEventEmitter<Size> 
) => {
  const onResize = () => emitter.emit( viewportEl.getBoundingClientRect())
  
  window.addEventListener('resize', onResize)
  
  const resizeEvent = new Event('resize')
  
  window.dispatchEvent(resizeEvent)
}
