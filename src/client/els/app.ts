import { div, footer, header, main, section } from '../lib/dom/h'

export const createAppEls = () => {  
  const appEl = div(
    { id: 'app' },
    header( 'Rect Editor' ),
    main(
      section({ id: 'tools' }),
      section({ id: 'viewport' }),
    ),
    footer( '© 2020 Nik Coughlin' )
  )

  return appEl
}
