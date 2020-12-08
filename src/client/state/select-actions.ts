import { State } from '../types'

export const selectActions = (state: State) => {
  const {
    add: addToSelection, remove: removeFromSelection, toggle: toggleSelected,
    any: isAnySelected, get: getSelected, set: setSelected,
    clear: clearSelection
  } = state.selector.actions

  return {
    addToSelection, removeFromSelection, toggleSelected, isAnySelected,
    getSelected, setSelected, clearSelection
  }
}
