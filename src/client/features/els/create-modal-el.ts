import { div, button } from '../../lib/dom/h'
import { FeatureEl, ModalModel } from '../types'

export const createModalEl = () => {
  const contentsStyle: Partial<CSSStyleDeclaration> = {
    textAlign: 'left'
  }

  const contentsEl = div({ style: contentsStyle })

  const closeButtonEl = button({ type: 'button' }, '❌')

  const windowStyle: Partial<CSSStyleDeclaration> = {
    background: '#fff',
    padding: '1rem',
    width: 'auto',
    height: 'auto',
    maxWidth: '100vw',
    maxHeight: '100vh',
    margin: 'auto',
    textAlign: 'right',
    boxShadow: '0 0 0.25rem rgba( 0, 0, 0, 0.25 )'
  }

  const windowEl = div({ style: windowStyle }, closeButtonEl, contentsEl)

  const modalStyle: Partial<CSSStyleDeclaration> = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'rgba( 255, 255, 255, 0.75 )',
    display: 'flex'
  }

  const modalEl = div({ style: modalStyle }, windowEl)

  const featureEl: FeatureEl<ModalModel> = {
    el: () => modalEl,
    featureId: () => 'modal',
    update: ({ contents, visible }: Partial<ModalModel>) => {
      if (contents) {
        contentsEl.innerHTML = ''
        contentsEl.append(contents)
      }

      modalEl.style.display = visible ? 'flex' : 'none'
    },
    setParent: (parent: FeatureEl) => {
      parent.el().append(modalEl)
    }
  }

  return featureEl
}