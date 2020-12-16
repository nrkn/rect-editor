import { Feature } from './types'

export const featureApp: Feature = {
  id: 'app',  
  provides: [ 'header', 'left', 'viewport', 'right'  ]  
}

export const featureModal: Feature = {
  id: 'modal',
  expectParent: 'app'
}
