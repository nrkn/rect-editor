import { rect } from '../lib/dom/s'
import { AppRect } from '../types'

export const createAppRectEl = ( appRect: AppRect ) => 
  rect( appRect, { fill: 'rgba( 0, 0, 0, 0.5 )', stroke: 'rgba( 0, 0, 0, 0.25 )' } )
