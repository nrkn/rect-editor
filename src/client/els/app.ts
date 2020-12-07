import { div, footer, header, main, section, p, pre } from '../lib/dom/h'

export const createAppEls = () => {  
  const appEl = div(
    { id: 'app' },
    header( 'Rect Editor' ),
    main(
      section({ id: 'tools' }),
      section({ id: 'viewport' }),
    ),
    footer( 
      p( '© 2020 Nik Coughlin' )
    )
  )

  return appEl
}
