import { Size } from '../../lib/geometry/types'
import { StrKey } from '../../lib/state/types'
import { AppMode } from '../app/types'

export type ToolsModel = {
  appMode: AppMode
  snapSize: Size
}

export const toolsModelKeys: StrKey<ToolsModel>[] = [ 
  'appMode', 'snapSize'
]
