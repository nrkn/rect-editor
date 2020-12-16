import { Feature, FeatureApp, FeatureEl, FeatureName } from './types'
import { validateFeatures } from './util'

export const createAppFromFeatures = (
  features: Feature[],
  fels: FeatureEl[]
) => {
  const result = validateFeatures(...features)

  if (result.length > 0) {
    result.forEach(r => console.warn(r))

    throw Error('Missing features')
  }

  let appEl: FeatureEl | undefined

  const featureMap = new Map<FeatureName, Feature>()
  const felMap = new Map<FeatureName, FeatureEl>()

  features.forEach(f => {
    featureMap.set(f.id, f)
  })

  fels.forEach(el => {
    const id = el.featureId()

    if (id === 'app') appEl = el

    felMap.set(id, el)
  })

  const felIds = [ ...felMap.keys() ]

  felIds.forEach( id => {
    const fel = felMap.get( id )

    if( !fel ) throw Error( `Expected feature element ${ id }` )

    if( !fel.setParent ) return

    const feature = featureMap.get( id )

    if( !feature ) throw Error( `Expected feature ${ id }`)

    const parentId = feature.expectParent

    if( !parentId ) return

    const parentEl = felMap.get( parentId )

    if( !parentEl ) throw Error( `Expected feature element ${ parentId }` )

    fel.setParent( parentEl )
  })

  let app: Partial<FeatureApp> = { appEl }

  return app
}
