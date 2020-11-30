
export const LEFT = 'left'
export const RIGHT = 'right'
export const TOP = 'top'
export const BOTTOM = 'bottom'
export const XCENTER = 'xCenter'
export const YCENTER = 'yCenter'

export const xSideNames = [ LEFT, RIGHT ] as const
export const ySideNames = [ TOP, BOTTOM ] as const
export const centerNames = [ XCENTER, YCENTER ] as const

export const sideNames = [ ...xSideNames, ...ySideNames ] as const

export const xPositionNames = [ LEFT, XCENTER, RIGHT ] as const
export const yPositionNames = [ TOP, YCENTER, BOTTOM ] as const

export const positionNames = [ ...xPositionNames, ...yPositionNames ] as const
