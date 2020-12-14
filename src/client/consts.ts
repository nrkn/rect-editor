export const appModes = [ 'pan', 'draw', 'select' ] as const

// TODO - options
export const minScale = 0.9
export const minDragDistance = 10
export const minDragTime = 300
export const handleSize = 8

export const listenerKeys = [
  'pan-wheel',
  'pan-drag',

  'select-click',
  'select-drag',
  'select-move-drag',
  'select-resize-drag',

  'draw-click',
  'draw-drag',

  'keys',
  'viewport-resize',
  'reset-zoom-click',
  'undo-click',
  'redo-click',
  'cursor-move',
  'snap-grid',
  'styles',
  'layers',
  'rects',
  'selection'
] as const
