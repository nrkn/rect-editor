import { Rect } from '../../../lib/geometry/types'
import { RectElement, UpdateRectElement } from './types'

export const isRectUpdate = <TRect extends Rect>(  
  value: RectElement<TRect> 
): value is UpdateRectElement<TRect> => 
  value.previous !== undefined

export const isRectUpdateArray = <TRect extends Rect>(  
  value: RectElement<TRect>[]
): value is UpdateRectElement<TRect>[] => 
  value.every( isRectUpdate )
