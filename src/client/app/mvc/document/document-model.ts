import { createCommands } from '../../../lib/commands'
import { createEmitter } from '../../../lib/events'
import { Rect, Size } from '../../../lib/geometry/types'
import { createSelector } from '../../../lib/select'

import { 
  createRects, removeRects, updateRects, createDocument, undoCommand, 
  redoCommand 
} from './fn'

import { 
  CreateEvent, RectElement, RemoveEvent, UpdateEvent, DocumentEvents, 
  CommandType, CommandElement, DocumentModel
} from './types'

export const createDocumentModel = <TRect extends Rect = Rect>( 
  size: Size 
) => {
  const elementMap = new Map<string, TRect>()
  const selectionSet = new Set<string>()  
  const commands = createCommands<CommandElement<TRect>, CommandType>()
  
  const create = (...rects: TRect[]) => {
    const newElements = createRects(elementMap, rects)

    commands.add({
      type: 'create',
      elements: newElements
    })

    events.create.emit(newElements)
  }

  const remove = (...ids: string[]) => {
    const removed = removeRects(elementMap, ids)

    commands.add({
      type: 'remove',
      elements: removed
    })

    events.remove.emit(ids)
  }

  const update = (...elements: RectElement<TRect>[]) => {
    const updates = updateRects( elementMap, elements )

    commands.add({
      type: 'update',
      elements: updates
    })

    events.update.emit(updates)
  }

  const undo = () => {
    const command = commands.nextUndo()

    if( command === undefined ) return

    undoCommand( elementMap, events, command )

    selectNone()
  }

  const redo = () => {
    const command = commands.nextRedo()

    if( command === undefined ) return

    redoCommand( elementMap, events, command )

    selectNone()
  }

  const { 
    select, deselect, isSelected, selectNone, toggleSelect, selectEmitter
  } = createSelector( selectionSet )

  const selectAll = () => select( ...elementMap.keys() )

  const events: DocumentEvents<TRect> = {
    create: createEmitter<CreateEvent<TRect>>(),
    remove: createEmitter<RemoveEvent>(),
    update: createEmitter<UpdateEvent<TRect>>(),
    select: selectEmitter
  }

  const document = () => createDocument(size, elementMap, selectionSet)

  const model: DocumentModel<TRect> = { 
    create, remove, update, undo, redo, document, events, select, deselect,
    isSelected, selectNone, toggleSelect, selectAll
  }

  return model
}
