import { minScale } from '../consts'
import { createCollection } from '../lib/collection'
import { Listener } from '../lib/events/types'
import { zoomAt } from '../lib/geometry/scale'
import { zoomToFit } from '../lib/geometry/size'
import { ScaleTransform, Size } from '../lib/geometry/types'
import { createSelector } from '../lib/select'
import { AppMode, AppRect, AppStyle, State, StateFn, StateListeners } from '../types'
import { createStyles } from './create-styles'

export const createState = (
  appRects: AppRect[],
  {
    listenAppMode, listenSnapToGrid, listenViewSize, listenDocumentSize,
    listenViewTransform, listenCurrentStyle
  }: StateListeners
) => {
  const mode = createMode( listenAppMode )
  const snap = createSnapToGrid( listenSnapToGrid )
  const viewSize = createViewSize( listenViewSize )
  const documentSize = createDocumentSize( listenDocumentSize )
  const currentStyleId = createCurrentStyle( listenCurrentStyle )

  const viewTransform = createViewTransform( listenViewTransform )
  
  const rects = createCollection<AppRect>( appRects )
  const styles = createCollection<AppStyle>( [] )

  const selector = createSelector()
  const keys: Record<string,boolean> = {}
  const zoomToFit = createZoomToFit( viewSize, documentSize, viewTransform )
  const zoomAt = createZoomAt( viewTransform )

  styles.add( createStyles() )

  if( styles.has( 'grey-0' ) ){
    currentStyleId( 'grey-0' )
  }

  const state: State = { 
    mode, snap, viewSize, viewTransform, documentSize, currentStyleId,
    rects, styles, selector, keys, dirty: true,
    zoomToFit, zoomAt
  }

  return state
}

const createMode = ( listener: Listener<AppMode> ) => {
  let appMode: AppMode = 'draw'

  const mode = (value?: AppMode) => {
    if (value !== undefined) {
      appMode = value
      
      listener( appMode )
    }

    return appMode
  }

  return mode
}

const createSnapToGrid = ( listener: Listener<Size> ) => {
  let size: Size = { width: 16, height: 16 }

  const snapSize = ( value?: Size ) => {
    if( value !== undefined ){
      size = value    

      listener( size )
    }
    
    return size
  }

  return snapSize
}

const createViewSize = ( listener: Listener<Size> ) => {
  let size: Size = { width: 0, height: 0 }

  const viewSize = (value?: Size) => {
    if (value !== undefined) {
      size = value

      listener( size )
    }

    const { width, height } = size
    
    return { width, height }
  }

  return viewSize
}

const createDocumentSize = ( listener: Listener<Size> ) => {
  let size: Size = { width: 0, height: 0 }

  const documentSize = (value?: Size) => {
    if (value !== undefined) {
      size = value

      listener( size )
    }

    const { width, height } = size
    
    return { width, height }
  }

  return documentSize
}

const createCurrentStyle = ( listener: Listener<string> ) => {
  let currentStyleId: string = ''

  const mode = (value?: string) => {
    if (value !== undefined) {
      currentStyleId = value
      
      listener( currentStyleId )
    }

    return currentStyleId
  }

  return mode
}

const createViewTransform = ( listener: Listener<ScaleTransform> ) => {
  let scaleTransform: ScaleTransform = { x: 0, y: 0, scale: 1 }

  const viewTransform = (value?: ScaleTransform) => {
    if (value !== undefined) {
      scaleTransform = value

      const { x, y, scale: transformScale } = scaleTransform

      const scale = Math.max(transformScale, minScale)

      listener( { x, y, scale })
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