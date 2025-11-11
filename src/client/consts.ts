export const appModes = [ 'pan', 'draw', 'select', 'pick', 'paint' ] as const

// TODO - options
export const minScale = 0.1
export const minDragDistance = 10
export const minDragTime = 300
export const handleSize = 8
export const zoomIntensity = 0.0015
export const defaultSnap = { width: 1, height: 1 } as const
export const defaultGrid = { width: 16, height: 16 } as const

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
  'visual-grid',
  'styles',
  'layers',
  'rects',
  'selection'
] as const
