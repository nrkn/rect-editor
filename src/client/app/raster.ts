const R = 0
const G = 1
const B = 2
const A = 3

export const createGridBg = ( width: number, height: number ) => {
  const canvas = document.createElement( 'canvas' )
  const context = canvas.getContext( '2d' )!

  canvas.width = width
  canvas.height = height

  const imageData = new ImageData( width, height )

  const highlight = [ 64, 64, 64, 255 ]
  const body = [ 32, 32, 32, 255 ]
  const shadow = [ 0, 0, 0, 255 ]

  const lastX = width - 1
  const lastY = height - 1

  for( let y = 0; y < height; y++ ){
    for( let x = 0; x < width; x++ ){
      const index = ( y * width + x ) * 4
      const r = index + R
      const g = index + G
      const b = index + B
      const a = index + A

      const isCorner = (
        ( x === 0 && y === lastY ) || 
        ( x === lastX && y === 0 )
      )
      
      const isHighLight = (
        !isCorner && 
        (x === 0 || y === 0)
      )
      
      const isShadow = (
        !isCorner && 
        !isHighLight && 
        ( x === lastX || y === lastY )
      )

      const color = (
        isHighLight ? highlight :
        isShadow ? shadow : 
        body
      )
      
      imageData.data[ r ] = color[ R ]
      imageData.data[ g ] = color[ G ]
      imageData.data[ b ] = color[ B ]
      imageData.data[ a ] = color[ A ]
    }
  }

  context.putImageData( imageData, 0, 0 )

  return canvas
}