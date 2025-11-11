import { Handler } from './types'

export const createHandler = (
  name: string, enabler: () => void, disabler: () => void
) => {
  let active = false

  const enable = () => {
    if( active ) return 

    enabler()
    active = true
  }

  const disable  = () => {
    if( !active ) return

    disabler()
    active = false
  }

  const isActive = () => active

  const handler: Handler = {
    name: () => name, enable, disable, isActive
  }

  return handler
}
