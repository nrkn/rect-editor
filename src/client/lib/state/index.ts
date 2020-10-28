import { createEmitter } from '../events'
import { clone, getKeys, strictValue, typedReducer } from '../util'

import { 
  EventedState, EventRecord, GetStateRecord, MapStateRecord, OnRecord, 
  SetStateRecord, State, StrKey 
} from './types'

export const createState = <T>( 
  keys: StrKey<T>[]
): State<T> => {
  const stateValues: Partial<T> = {}

  const get = typedReducer<GetStateRecord<T>>(
    keys,
    key => () => clone( strictValue( stateValues, key ) )
  )

  const set = typedReducer<SetStateRecord<T>>(
    keys,
    key => value => { stateValues[ key ] = clone( value ) }
  )

  return { get, set }
}

export const createMappedState = <T>(
  state: State<T>,
  mapper: Partial<MapStateRecord<T>>
): State<T> => {
  const { get, set: originalSet } = state

  const keys = getKeys( originalSet )

  const set = typedReducer<SetStateRecord<T>>(
    keys,
    key => value => {
      const map = mapper[ key ]

      if( map !== undefined ) value = map( value )

      originalSet[ key ]( value )
    }
  )

  return { get, set }
}

export const createEventedState = <T>(
  state: State<T>,
  events: EventRecord<T> = createEvents( getKeys( state.set ) )
): EventedState<T> => {
  const { get, set: originalSet } = state

  const keys = getKeys( originalSet )

  const set = typedReducer<SetStateRecord<T>>(
    keys,
    key => value => {
      originalSet[ key ]( value )

      events[ key ].emit( get[ key ]() )
    }   
  )

  const on = typedReducer<OnRecord<T>>(
    keys,
    key => listener => events[ key ].on( listener )
  )

  return { get, set, on }
}

export const createEvents = <T>( keys: StrKey<T>[] ): EventRecord<T> => 
  typedReducer<EventRecord<T>>( keys, () => createEmitter() )

export const pipeState = <T>(
  sender: OnRecord<T>, receiver: SetStateRecord<T>
) => {
  const keys = getKeys( sender )

  keys.forEach( key => sender[ key ]( receiver[ key ] ) )
}

export const pipeStatePartial = <T>(
  sender: OnRecord<T>, receiver: Partial<SetStateRecord<T>>
) => {
  const keys = getKeys( sender )

  keys.forEach( key => {
    const send = sender[ key ]!
    const receive = receiver[ key ]

    if( receive === undefined ) return

    send( receive! )
  })
}
