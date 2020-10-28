import { Commands, CommandList } from './types'

export const createCommands = <T>(): Commands<T> => {
  const commands: CommandList<T> = {
    list: [],
    nextIndex: 0
  }

  const add = ( command: T ) => 
    addCommand( commands, command )

  const nextUndo  = () => nextUndoCommand( commands )
  const nextRedo = () => nextRedoCommand( commands )  

  return { add, nextUndo, nextRedo }
}

const addCommand =  <T>( 
  commands: CommandList<T>, 
  command: T
) => {
  const { nextIndex } = commands

  commands.list = [ ...commands.list.slice( 0, nextIndex ), command ]
  commands.nextIndex = commands.list.length
}

const nextUndoCommand = <T>( 
  commands: CommandList<T>
) => {
  const { list } = commands

  if( list.length === 0 || commands.nextIndex === 0 ) return

  const command = list[ commands.nextIndex - 1 ]

  commands.nextIndex--

  return command
}

const nextRedoCommand = <T>(
  commands: CommandList<T>
) => {
  const { list, nextIndex } = commands

  if( list.length === 0 || nextIndex >= list.length ) return

  const command = list[ commands.nextIndex ]

  commands.nextIndex++

  return command
}
