import { createEmitter } from '../events'

export const createSelector = <T = string>( set: Set<T> ) => {
  const selectEmitter = createEmitter<T[]>()

  const select = ( ...values: T[] ) => {
    values.forEach( v => set.add( v ) )

    selectEmitter.emit( [ ...set ] )
  }

  const deselect = ( ...values: T[] ) => {
    values.forEach( v => set.delete( v ) )

    selectEmitter.emit( [ ...set ] )
  }

  const isSelected = ( value: T ) => set.has( value )

  const selectNone = () => {
    set.clear()

    selectEmitter.emit( [] )
  }

  const toggleSelect = ( ...values: T[] ) => {
    values.forEach( v => {
      if( set.has( v ) ){
        set.delete( v )
      } else {
        set.add( v )
      }
    })

    selectEmitter.emit( [ ...set ] )
  }

  return { 
    select, deselect, isSelected, selectNone, toggleSelect, selectEmitter 
  }
}
