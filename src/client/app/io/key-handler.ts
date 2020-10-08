import { switchMode } from '../actions/mode'
import { selectAll, selectNone } from '../actions/select'
import { zoomToFit, zoomAt } from '../actions/zoom'
import { redoCommand, undoCommand } from '../commands'
import { applyTransform, getLocalCenter } from '../geometry'
import { AppState } from '../types'

export const keyHandler = (state: AppState, key: string) => {
  const { options } = state
  
  if (isResetZoom(key)) {
    zoomToFit(state)

    return true
  }

  if (isZoom(key)) {
    const { x, y } = getLocalCenter(state)

    let scale = state.transform.scale

    if (key === '-') {
      scale = state.transform.scale - 0.25
    }

    if (key === '+') {
      scale = state.transform.scale + 0.25
    }

    zoomAt(state, { x, y, scale })

    return true
  }

  if (isMove(key)) {
    const { cellSize } = options

    let { width, height } = cellSize
    let { x, y, scale } = state.transform

    width *= scale
    height *= scale

    if (key === 'ArrowLeft') {
      x += width
    }

    if (key === 'ArrowRight') {
      x -= width
    }

    if (key === 'ArrowUp') {
      y += height
    }

    if (key === 'ArrowDown') {
      y -= height
    }

    Object.assign(state.transform, { x, y })

    applyTransform(state)

    return true
  }

  if( isDelete( key )){
    // ...

    return true
  }

  if( isUndoRedo( key ) && state.keys.Control ){
    if( state.keys.Shift ){     
      redoCommand( state )
    } else {
      undoCommand( state )
    }

    return true
  }

  if( isSelectAllNone( key ) && state.keys.Control ){
    if( state.keys.Shift ){
      selectNone( state )
    } else {
      selectAll( state )
    }

    switchMode( state, 'select' )

    return true
  }

  return false
}

const isResetZoom = (key: string) => key === '*'

const isDelete = ( key: string ) => key === 'Delete'

const isZoom = (key: string) => ['-', '+'].includes(key)

const isMove = (key: string) =>
  ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)

const isUndoRedo = ( key: string ) => key.toLowerCase() === 'z'

const isSelectAllNone = ( key: string ) => key.toLowerCase() === 'a'
