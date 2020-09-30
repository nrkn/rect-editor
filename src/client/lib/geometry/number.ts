export const snapToGrid = (
  value: number, grid: number
) => Math.floor( value / grid ) * grid
