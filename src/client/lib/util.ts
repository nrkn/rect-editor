export const randomId = () => 
  createSequence( 16, randomChar ).join( '' )

export const randomChar = () => String.fromCharCode( randomInt( 26 ) + 97 )

export const randomInt = ( exclMax: number ) => 
  Math.floor( Math.random() * exclMax )

export const createSequence = <T>( 
  length: number, cb: ( index: number ) => T 
) =>
  Array.from( { length }, ( _v, index ) => cb( index ) )
