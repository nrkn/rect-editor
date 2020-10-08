import { strictSelect } from '../../lib/dom/util'
import { Rect } from '../../lib/geometry/types'
import { selectNone } from '../actions/select'
import { createRectEl, setRectElRect } from '../dom/rects'
import { AppState } from '../types'

import { 
  Command, CommandElement, EditCommandElement, CommandHandlerMap 
} from './types'

export const newCommand = ( state: AppState, command: Command ) => {
  const { commands } = state
  const { nextIndex } = commands

  commands.list = [ ...commands.list.slice( 0, nextIndex ), command ]
  commands.nextIndex = commands.list.length
}

export const undoCommand = ( state: AppState ) => {
  const { commands } = state
  const { list } = commands

  if( list.length === 0 ) return

  const command = list[ commands.nextIndex - 1 ]

  // wtf how to do this?
  undoCommands[ command.type ]( state, command as any )

  commands.nextIndex--

  selectNone( state )
}

export const redoCommand = ( state: AppState ) => {
  const { commands } = state
  const { list, nextIndex } = commands

  if( list.length === 0 || nextIndex === list.length ) return

  const command = list[ commands.nextIndex ]

  // wtf how to do this?
  redoCommands[ command.type ]( state, command as any )

  commands.nextIndex++

  selectNone( state )
}

const add = ( state: AppState, { id, rect }: CommandElement ) => {
  const rectEl = createRectEl( id, rect )

  /* 
    TODO - how to put it back in the right place in the dom list? Keep track 
    of previous/next siblings? 
  */

  state.dom.groupEl.append( rectEl )
}

const del = ( state: AppState, { id }: CommandElement ) => {
  const rectEl = strictSelect( `#${ id }`, state.dom.groupEl )

  rectEl.remove()  
}

const edit = ( state: AppState, id: string, rect: Rect ) => {
  const rectEl = strictSelect<SVGRectElement>( 
    `#${ id }`, state.dom.groupEl 
  )

  setRectElRect( rectEl, rect )
}

const addElements = ( state: AppState, elements: CommandElement[] ) => 
  elements.forEach( el => add( state, el ) )

  const deleteElements = ( state: AppState, elements: CommandElement[] ) =>
  elements.forEach( el => del( state, el ) )

const editElementsUndo = ( state: AppState, elements: EditCommandElement[] ) =>
  elements.forEach( el => edit( state, el.id, el.previous ) )

const editElementsRedo = ( state: AppState, elements: EditCommandElement[] ) =>
  elements.forEach( el => edit( state, el.id, el.rect ) )

const redoCommands: CommandHandlerMap<AppState> = {
  add: ( state, command ) => addElements( state, command.elements ),
  delete: ( state, command ) => deleteElements( state, command.elements ),
  edit: ( state, command ) => editElementsRedo( state, command.elements )
}

const undoCommands: CommandHandlerMap<AppState> = {
  add: ( state, command ) => deleteElements( state, command.elements ),
  delete: ( state, command ) => addElements( state, command.elements ),
  edit: ( state, command ) => editElementsUndo( state, command.elements )
}
