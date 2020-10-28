import { Command, CommandList } from './types'

export const createCommands = <TElement, TTypes>() => {
  const commands: CommandList<TElement, TTypes> = {
    list: [],
    nextIndex: 0
  }

  const add = ( command: Command<TElement, TTypes> ) => addCommand( commands, command )
  const nextUndo  = () => nextUndoCommand( commands )
  const nextRedo = () => nextRedoCommand( commands )  

  return { add, nextUndo, nextRedo }
}

const addCommand =  <TElement, TTypes>( 
  commands: CommandList<TElement, TTypes>, command: Command<TElement, TTypes>
) => {
  const { nextIndex } = commands

  commands.list = [ ...commands.list.slice( 0, nextIndex ), command ]
  commands.nextIndex = commands.list.length
}

const nextUndoCommand = <TElement, TTypes>( 
  commands: CommandList<TElement, TTypes>
) => {
  const { list } = commands

  if( list.length === 0 ) return

  const command = list[ commands.nextIndex - 1 ]

  commands.nextIndex--

  return command
}

const nextRedoCommand = <TElement, TTypes>(
  commands: CommandList<TElement, TTypes>
) => {
  const { list, nextIndex } = commands

  if( list.length === 0 || nextIndex >= list.length ) return

  const command = list[ commands.nextIndex ]

  commands.nextIndex++

  return command
}