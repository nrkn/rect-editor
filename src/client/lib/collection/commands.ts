import { 
  CollectionCommand, CollectionEvents, CollectionTasks, ID 
} from './types'

export const undoCommand = <T extends ID>(
  { addOne, removeOne, updateOne, setOrder }: CollectionTasks<T>,
  events: CollectionEvents<T>,
  command: CollectionCommand<T>
) => {
  if (command.type === 'add') {
    const ids = command.elements.map(el => el.id)

    ids.forEach(removeOne)
    events.remove.emit(ids)
  }

  if (command.type === 'remove') {
    command.elements.forEach(addOne)
    setOrder(command.before)

    events.add.emit(command.elements)
    events.setOrder.emit(command.before)
  }

  if (command.type === 'update') {
    const values = command.elements.map(el => el.prev)

    values.forEach(updateOne)
    events.update.emit(values)
  }

  if (command.type === 'order') {
    setOrder(command.before)
    events.setOrder.emit(command.before)
  }
}

export const redoCommand = <T extends ID>(
  { addOne, removeOne, updateOne, setOrder }: CollectionTasks<T>,
  events: CollectionEvents<T>,
  command: CollectionCommand<T>
) => {
  if (command.type === 'add') {
    command.elements.forEach(addOne)

    events.add.emit(command.elements)
  }

  if (command.type === 'remove') {
    const ids = command.elements.map(el => el.id)

    ids.forEach(removeOne)
    events.remove.emit(ids)
  }

  if (command.type === 'update') {
    const values = command.elements.map(el => el.value)

    values.forEach(updateOne)
    events.update.emit(values)
  }

  if (command.type === 'order') {
    setOrder(command.after)

    events.setOrder.emit(command.after)
  }
}