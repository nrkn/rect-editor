import { createEmitter } from '../events'
import { clone } from '../util'
import { SelectActions } from './types'

export const createSelector = <T = string>() => {
  const set = new Set<T>() 
  const selectEmitter = createEmitter<T[]>()

  const actions: SelectActions<T> = {
    add: values => {
      values.forEach( v => set.add( v ) )

      selectEmitter.emit( [ ...set ] )
    },
    remove: values => {
      values.forEach( v => set.delete( v ) )

      selectEmitter.emit( [ ...set ] )
    },
    toggle: values => {
      values.forEach( v => {
        if( set.has( v ) ){
          set.delete( v )
        } else {
          set.add( v )
        }
      })
  
      selectEmitter.emit( [ ...set ] )
    },
    clear: () => {
      set.clear()

      selectEmitter.emit( [] )
    },
    get: () => clone( [ ...set ] ),
    set: values => {
      set.clear()
      actions.add( values )
    },
    any: () => set.size > 0,
  }

  const { on } = selectEmitter

  return { actions, on }
}
