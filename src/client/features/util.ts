import { Feature, FeatureName, FeatureValidationResult } from './types'

export const validateFeatures = (...features: Feature[]) => {
  const featureNames = new Set<string>()

  features.forEach(
    feature => {
      featureNames.add(feature.id)

      feature.provides?.forEach(
        provideName => featureNames.add(provideName)
      )
    }
  )

  const result: FeatureValidationResult[] = []

  features.forEach(
    feature => {
      if (feature.expectParent) {
        if (!featureNames.has(feature.expectParent)) {
          result.push(
            {
              missing: feature.expectParent,
              requiredBy: feature.id
            }
          )
        }
      }

      if (feature.expectChildren) {
        feature.expectChildren.forEach(
          childName => {
            if( !featureNames.has( childName)){
              result.push( 
                {
                  missing: childName,
                  requiredBy: feature.id
                }
              )
            }
          }
        )
      }
    }
  )

  return result
}