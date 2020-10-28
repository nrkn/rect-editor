import { Command } from '../../../lib/commands/types'
import { Rect, Size } from '../../../lib/geometry/types'
import { randomId, clone } from '../../../lib/util'
import { isRectUpdate, isRectUpdateArray } from './predicates'

import { 
  RectElement, UpdateRectElement, RectDocument, DocumentEvents, CommandElement, 
  CommandType 
} from './types'

export const createRects =  <TRect extends Rect>(
  elementMap: Map<string, TRect>, rects: TRect[]
) => {
  const newElements: RectElement<TRect>[] = []

  rects.forEach(rect => {
    const rectElement: RectElement<TRect> = {
      id: randomId(),
      rect
    }

    newElements.push(rectElement)
    elementMap.set(rectElement.id, rect)
  })

  return newElements
}

export const createRectsFromElements =  <TRect extends Rect>(
  elementMap: Map<string, TRect>, elements: RectElement<TRect>[]
) => {
  elements.forEach(
    ( { id, rect } ) => {
      if( elementMap.has( id ) ){
        throw Error( `Rect with id ${ id } already exists` )
      }

      elementMap.set( id, rect )
    }
  )
}

export const removeRects = <TRect extends Rect>(
  elementMap: Map<string, TRect>, ids: string[]
) => {
  const removed: RectElement<TRect>[] = []
  
  ids.forEach(id => {
    const rect = elementMap.get( id )

    if (rect === undefined) {
      throw Error(`Could not delete rect with id ${id}`)
    }

    removed.push( { id, rect } )

    elementMap.delete(id)
  })

  return removed
}

export const updateRects = <TRect extends Rect>(
  elementMap: Map<string, TRect>, elements: RectElement<TRect>[]
) => {
  const updates: UpdateRectElement<TRect>[] = []

  elements.forEach(({ id, rect }) => {
    const previous = elementMap.get(id)

    if (previous === undefined) {
      throw Error(`No rect found with id ${id}`)
    }

    updates.push({ id, rect, previous })

    elementMap.set(id, rect)
  })

  return updates
}

export const createDocument = <TRect extends Rect>(
  { width, height }: Size, elementMap: Map<string, TRect>,
  selectionSet: Set<string>
) => {
  const size = { width, height }
  const elements: RectElement<TRect>[] = []
  const selection = [...selectionSet]

  elementMap.forEach(( rect, id) => {
    rect = clone( rect )

    elements.push({ id, rect })
  })

  const doc: RectDocument<TRect> = {
    size, elements, selection
  }

  return doc
}

export const invertUpdateRect = <TRect extends Rect>(
  element: RectElement<TRect>
) => {
  if( !isRectUpdate( element ) ){
    throw Error( `Expected a RectUpdate` )
  }
  
  const { id, rect: previous, previous: rect } = element

  return { id, rect, previous }
}

export const undoCommand = <TRect extends Rect>(
  elementMap: Map<string, TRect>, events: DocumentEvents<TRect>, 
  command: Command<CommandElement<TRect>,CommandType>
) => {
  switch( command.type ){
    case 'create': {
      const ids = command.elements.map( el => el.id )

      removeRects( elementMap, ids )

      events.remove.emit( ids )
    }
    case 'remove': {
      createRectsFromElements( elementMap, command.elements )

      events.create.emit( command.elements )
    }
    case 'update': {
      const elements = command.elements.map( invertUpdateRect )

      updateRects( elementMap, elements )

      events.update.emit( elements )
    }
  }  
}

export const redoCommand = <TRect extends Rect>(
  elementMap: Map<string, TRect>, events: DocumentEvents<TRect>, 
  command: Command<CommandElement<TRect>,CommandType>
) => {
  switch( command.type ){
    case 'create': {
      createRectsFromElements( elementMap, command.elements )

      events.create.emit( command.elements )
    }
    case 'remove': {
      const ids = command.elements.map( el => el.id )

      removeRects( elementMap, ids )

      events.remove.emit( ids )
    }
    case 'update': {
      if( !isRectUpdateArray( command.elements ) ){
        throw Error( 'Expected an array of RectUpdate' )
      }

      updateRects( elementMap, command.elements )

      events.update.emit( command.elements )
    }
  }  
}
