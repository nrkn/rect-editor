type ButtonName = 'main' | 'secondary'

export const mouseButtons: Record<ButtonName,boolean> = {
  main: false,
  secondary: false
}

document.addEventListener( 'mousedown', e => {
  if( e.button === 0 ) mouseButtons.main = true
  if( e.button === 2 ) mouseButtons.secondary = true
})

document.addEventListener( 'mouseup', e => {
  if( e.button === 0 ) mouseButtons.main = false
  if( e.button === 2 ) mouseButtons.secondary = false
})
