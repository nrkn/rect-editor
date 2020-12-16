import { div, footer, h1, header, main, section } from '../../lib/dom/h'
import { AppModel, FeatureEl, FeatureName } from '../types'

export const createAppEl = () => {
  const titleEl = h1()
  const headerEl =  header( titleEl )
  const toolsEl = section()
  const viewportEl = section()
  const layersEl = section()
  const footerEl = footer()

  const style: Partial<CSSStyleDeclaration> = {
    background: '#fff',
    color: '#000',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative'    
  }

  const appEl = div(
    { style },
    headerEl,
    main(
      toolsEl,
      viewportEl,
      layersEl
    ),
    footerEl     
  )

  const children: Partial<Record<FeatureName,HTMLElement>> = {
    title: titleEl,
    header: headerEl,
    left: toolsEl,
    viewport: viewportEl,
    right: layersEl,
    footer: footerEl
  }

  const featureEl: FeatureEl<AppModel> = {
    featureId: () => 'app',
    el: () => appEl,
    child: ( name: FeatureName ) => {
      if( name in children ){
        return children[ name ]
      }
    },
    update: ( { titleHTML }: Partial<AppModel> = {} ) => {
      titleEl.innerHTML = titleHTML || 'Title'
    }
  }

  return featureEl
}
