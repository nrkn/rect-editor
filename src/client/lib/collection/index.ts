import {
  Collection, CollectionCommand, CollectionEvents, CollectionListener, ID
} from './types'

import { createNode, TreeNode } from '@mojule/tree-node'
import { strictMapGet } from '../util'
import { createCommands } from '../commands'
import { createEmitter } from '../events'
import { createTasks } from './tasks'
import { undoCommand, redoCommand } from './commands'
import { createOrderActions } from './order'
import { Commands } from '../commands/types'

export const createCollection = <T extends ID>(
  initialElements: T[]
) => {
  const { 
    root, elMap, commands, events, on, off, tasks, orderActions, reorder 
  } = initCollection<T>()

  initialElements.forEach( tasks.addOne )

  const add = (elements: T[]) => {
    elements.forEach(tasks.addOne)

    commands.add({ type: 'add', elements })

    events.add.emit(elements)
  }

  const remove = (ids: string[]) => {
    const before = root.childNodes.map(n => n.value.id)

    const elements = ids.map(tasks.removeOne)

    commands.add({ type: 'remove', before, elements })

    events.remove.emit(ids)
  }

  const update = (elements: T[]) => {
    const updateElements = elements.map(tasks.updateOne)

    commands.add({ type: 'update', elements: updateElements })

    events.update.emit(elements)
  }

  const toStart = reorder(orderActions.toStart)

  const toEnd = reorder(orderActions.toEnd)

  const forward = reorder(orderActions.forward)

  const back = reorder(orderActions.back)

  const has = (id: string) => elMap.has(id)

  const get = (id: string) => strictMapGet(elMap, id).value

  const toArray = () => root.childNodes.map(n => n.value)

  const undo = () => {
    const command = commands.nextUndo()

    if (command === undefined) return false

    undoCommand(tasks, events, command)

    events.undo.emit()

    return true
  }

  const redo = () => {
    const command = commands.nextRedo()

    if (command === undefined) return false

    redoCommand(tasks, events, command)

    events.redo.emit()

    return true
  }

  const collection: Collection<T> = {
    add, remove, update, toStart, toEnd, forward, back, has, get, toArray,
    undo, redo, on, off
  }

  return collection
}

const initCollection = <T extends ID>() => {
  const root = createNode<T>({ id: 'root' } as T)
  const elMap = new Map<string, TreeNode<T>>()
  const commands = createCommands<CollectionCommand<T>>()

  const events = {
    add: createEmitter<T[]>(),
    remove: createEmitter<string[]>(),
    update: createEmitter<T[]>(),
    setOrder: createEmitter<string[]>(),
    undo: createEmitter<void>(),
    redo: createEmitter<void>()
  }

  const on: CollectionListener<T> = {
    add: events.add.on,
    remove: events.remove.on,
    update: events.update.on,
    setOrder: events.setOrder.on,
    undo: events.undo.on,
    redo: events.redo.on
  }

  const off: CollectionListener<T> = {
    add: events.add.off,
    remove: events.remove.off,
    update: events.update.off,
    setOrder: events.setOrder.off,
    undo: events.undo.off,
    redo: events.redo.off
  }

  const tasks = createTasks(elMap, root)
  const orderActions = createOrderActions(elMap, root)
  const reorder = createReorder( events, commands, root )  

  return { 
    root, elMap, commands, events, on, off, tasks, orderActions, reorder 
  }
}

const createReorder = <T extends ID>(
  events: CollectionEvents<T>,
  commands: Commands<CollectionCommand<T>>,
  root: TreeNode<T>
) => {
  const reorder = (action: (ids: string[]) => void) => {
    const handleCommandAndEvents = (ids: string[]) => {
      const before = root.childNodes.map(n => n.value.id)

      action(ids)

      const after = root.childNodes.map(n => n.value.id)

      commands.add({ type: 'order', before, after })
      events.setOrder.emit(after)
    }

    return handleCommandAndEvents
  }

  return reorder
}
