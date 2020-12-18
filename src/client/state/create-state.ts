import { minScale } from '../consts'
import { createCollection } from '../lib/collection'
import { zoomAt } from '../lib/geometry/scale'
import { zoomToFit } from '../lib/geometry/size'
import { ScaleTransform, Size } from '../lib/geometry/types'
import { createSelector } from '../lib/select'

import { 
  AppMode, AppRect, AppStyle, BackgroundImage, State, StateFn, StateListeners 
} from '../types'

import { createAppStyles } from './create-app-styles'

export const createState = (
  appRects: AppRect[],
  listeners: StateListeners
) => {
  const mode = createMode( listeners )
  const snap = createSnapToGrid( listeners )
  const viewSize = createViewSize( listeners )
  const documentSize = createDocumentSize( listeners )
  const currentStyleId = createCurrentStyle( listeners )

  const viewTransform = createViewTransform( listeners )

  const backgroundImage = createBackgroundImage( listeners )
  
  const rects = createCollection<AppRect>( appRects )
  const styles = createCollection<AppStyle>( [] )

  const selector = createSelector()
  const keys: Record<string,boolean> = {}
  const zoomToFit = createZoomToFit( viewSize, documentSize, viewTransform )
  const zoomAt = createZoomAt( viewTransform )

  styles.add( createAppStyles() )

  if( styles.has( 'grey-0' ) ){
    currentStyleId( 'grey-0' )
  }

  const state: State = { 
    mode, snap, viewSize, viewTransform, documentSize, currentStyleId,
    backgroundImage,

    rects, styles, selector, keys, dirty: true,

    zoomToFit, zoomAt
  }

  return state
}

const createBackgroundImage = ( listeners: StateListeners ) => {
  let backgroundImage: BackgroundImage | undefined = undefined

  const image = ( value?: BackgroundImage ) => {
    if( value !== undefined ){
      backgroundImage = value

      listeners.listenBackgroundImage( backgroundImage )
    }

    return backgroundImage
  }

  return image
}

const createMode = ( listeners: StateListeners ) => {
  let appMode: AppMode = 'draw'

  const mode = (value?: AppMode) => {
    if (value !== undefined) {
      appMode = value
      
      listeners.listenAppMode( appMode )
    }

    return appMode
  }

  return mode
}

const createSnapToGrid = ( listeners: StateListeners ) => {
  let size: Size = { width: 16, height: 16 }

  const snapSize = ( value?: Size ) => {
    if( value !== undefined ){
      size = value    

      listeners.listenSnapToGrid( size )
    }
    
    return size
  }

  return snapSize
}

const createViewSize = ( listeners: StateListeners ) => {
  let size: Size = { width: 0, height: 0 }

  const viewSize = (value?: Size) => {
    if (value !== undefined) {
      size = value

      listeners.listenViewSize( size )
    }

    const { width, height } = size
    
    return { width, height }
  }

  return viewSize
}

const createDocumentSize = ( listeners: StateListeners ) => {
  let size: Size = { width: 0, height: 0 }

  const documentSize = (value?: Size) => {
    if (value !== undefined) {
      size = value

      listeners.listenDocumentSize( size )
    }

    const { width, height } = size
    
    return { width, height }
  }

  return documentSize
}

const createCurrentStyle = ( listeners: StateListeners ) => {
  let currentStyleId: string = ''

  const mode = (value?: string) => {
    if (value !== undefined) {
      currentStyleId = value
      
      listeners.listenCurrentStyle( currentStyleId )
    }

    return currentStyleId
  }

  return mode
}

const createViewTransform = ( listeners: StateListeners ) => {
  let scaleTransform: ScaleTransform = { x: 0, y: 0, scale: 1 }

  const viewTransform = (value?: ScaleTransform) => {
    if (value !== undefined) {
      scaleTransform = value

      const { x, y, scale: transformScale } = scaleTransform

      const scale = Math.max(transformScale, minScale)

      listeners.listenViewTransform( { x, y, scale })
    }

    const { x, y, scale } = scaleTransform

    return { x, y, scale }
  }

  return viewTransform
}

const createZoomToFit = (
  viewSize: StateFn<Size>, documentSize: StateFn<Size>,
  viewTransform: StateFn<ScaleTransform>
) => {
  const action = () =>
    viewTransform(
      zoomToFit(viewSize(), documentSize())
    )

  return action
}

const createZoomAt = (
  viewTransform: StateFn<ScaleTransform>
) => {
  const action = (transform: ScaleTransform) =>
    viewTransform(
      zoomAt(viewTransform(), transform, minScale)
    )

  return action
}