import { isRect, isSize } from './lib/geometry/predicates'
import { AppRect, DocumentData } from './types'

export const isAppRect = ( value: any ): value is AppRect =>
  value && 
  typeof value.id === 'string' && 
  typeof value[ 'data-style' ] === 'string' && 
  isRect( value )

export const isDocumentData = ( value: any ): value is DocumentData => 
  value && 
  isSize( value.snap ) && 
  isSize( value.grid ) &&
  isSize( value.documentSize ) &&
  Array.isArray( value.rects ) &&
  value.rects.every( isAppRect )
