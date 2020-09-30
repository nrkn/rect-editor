import { AppMode, appModes } from './types'

export const isAppMode = ( value: any ): value is AppMode => 
  appModes.includes( value )
