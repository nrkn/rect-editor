import { startApp } from '../controllers/app/start-app'
import { AppOptions } from '../controllers/app/types'

export const createApp = () => {
  startApp( options )
}

const options: AppOptions = {
  gridSize: { width: 1000, height: 1000 },
  cellSize: { width: 16, height: 16 },
  minScale: 0.1,
  snap: { width: 2, height: 2 },
}
