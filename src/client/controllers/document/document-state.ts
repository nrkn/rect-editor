import { createCollection } from '../../lib/collection'
import { 
  createEventedState, createEvents, createState 
} from '../../lib/state'
import { RectModel } from '../rect/types'

import { DocumentViewModel, documentStateKeys } from './types'

export const createDocumentState = () => {
  const rectCollection = createCollection<RectModel>()

  const state = createState<DocumentViewModel>( documentStateKeys )
  const events = createEvents<DocumentViewModel>( documentStateKeys )
  const documentState = createEventedState( state, events )

  return { rectCollection, documentState }
}
