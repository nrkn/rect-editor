import { Handler } from '../lib/handlers/types'
import { featureNames } from './consts'

export type FeatureName = typeof featureNames[ number ]

export type Feature = {
  id: FeatureName
  provides?: FeatureName[]
  expectChildren?: FeatureName[]
  expectParent?: FeatureName  
}

export type FeatureEl<Model = any> = {
  featureId: () => FeatureName
  el: () => HTMLElement | SVGElement
  child?: ( name: FeatureName ) => HTMLElement | SVGElement | undefined
  update?: ( model: Model ) => void
  value?: () => Model
  setParent?: ( parent: FeatureEl ) => void
}

export type FeatureHandler = {
  featureId: () => FeatureName
  handler: Handler
}

export type FeatureValidationResult = {
  missing: FeatureName
  requiredBy: FeatureName
}

export type AppModel = {
  titleHTML: string
}

export type ModalModel = {
  contents: Node
  visible: boolean
}

export type FeatureApp = {
  appEl: FeatureEl
}
