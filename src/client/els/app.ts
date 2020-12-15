import { div, footer, header, main, section, p, h1 } from '../lib/dom/h'
import { createModal } from './modal'

export const createAppEls = () => {  
  const appEl = div(
    { id: 'app' },
    header( h1( 'Rect Editor' ) ),
    main(
      section({ id: 'tools' }),
      section({ id: 'viewport' }),
      section({ id: 'layers' } )
    ),
    footer( 
      p( '© 2020 Nik Coughlin' )
    ),
    createModal() 
  )

  return appEl
}

