import { Rect } from '../../lib/geometry/types'

export type CommandTypeMap = {
  add: AddCommand
  delete: DeleteCommand
  edit: EditCommand
}

export type CommandType = keyof CommandTypeMap

export const actionTypes: Readonly<CommandType[]> = [ 
  'add', 'delete', 'edit' 
] as const


export type CommandElement = {
  rect: Rect
  previous?: Rect
  id: string 
}

export type EditCommandElement = CommandElement & {
  previous: Rect
}

type CommandBase = {
  type: CommandType
  elements: CommandElement[]
}

export type AddCommand = CommandBase & {
  type: 'add'
}

export type DeleteCommand = CommandBase & {
  type: 'delete'
}

export type EditCommand = CommandBase & {
  type: 'edit'
  elements: EditCommandElement[]
}

export type Command = AddCommand | DeleteCommand | EditCommand

export type CommandList = {
  list: Command[]
  nextIndex: number
}

export type CommandHandler<K extends CommandType, State> = ( 
  state: State, command: CommandTypeMap[ K ]
) => void

export type CommandHandlerMap<State> = {
  [K in CommandType]: CommandHandler<K, State>
}
