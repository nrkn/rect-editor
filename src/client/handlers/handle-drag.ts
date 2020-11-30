import { strictSelect } from '../lib/dom/util'
import { Point } from '../lib/geometry/types'
import { State } from '../types'
import { DragCallback, DragOptions } from './types'
import { createTranslatePoint, getPosition } from './util'

export const handleDrag = (
  state: State, 
  onDrag: DragCallback,
  {
    onStart = () => {}, 
    onEnd = () => {}, 
    transformPoint = createTranslatePoint( state ),
    predicate = () => true
  }: Partial<DragOptions> = {}
) => {
  const viewportEl = strictSelect<HTMLElement>('#viewport')

  let start: Point | null = null
  let prev: Point | null = null
  let end: Point | null = null

  viewportEl.addEventListener('mousedown', e => {
    if ( !predicate( e, 'start' ) ) return

    const bounds = viewportEl.getBoundingClientRect()

    start = end = prev = transformPoint( getPosition( e, bounds ) )

    onStart( start, end, prev )
  })

  viewportEl.addEventListener('mousemove', e => {
    if ( !predicate( e, 'drag' ) ) return
    if( start === null || prev === null || end === null ) return

    const bounds = viewportEl.getBoundingClientRect()

    prev = end
    end = transformPoint( getPosition( e, bounds ) )

    onDrag( start, end, prev )
  })

  viewportEl.addEventListener('mouseup', e => {
    if ( !predicate( e, 'end' ) ) return
    if( start === null || prev === null || end === null  ) return

    onEnd( start, end, prev )

    start = null
    end = null
  })
}
