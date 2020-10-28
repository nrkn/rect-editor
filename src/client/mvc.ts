import { createAppController } from './app/mvc/app/app-controller'
import { AppOptions } from './app/types'

export const createApp = (opts: Partial<AppOptions> = {}) => {
  const options: AppOptions = Object.assign({}, defaultOptions, opts)

  const controller = createAppController( options )

  controller.run()
}

const defaultOptions: AppOptions = {
  gridSize: { width: 1000, height: 1000 },
  cellSize: { width: 16, height: 16 },
  minScale: 0.1,
  snap: { width: 1, height: 1 },
}

createApp()
