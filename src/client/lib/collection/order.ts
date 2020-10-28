import { TreeNode } from '@mojule/tree-node'
import { strictMapGet } from '../util'
import { ID } from './types'

export const createOrderActions = <T extends ID>(
  elMap: Map<string, TreeNode<T>>,
  root: TreeNode<T>
) => {
  const toStart = (ids: string[]) => {
    sortIds(elMap, ids).reverse().forEach(id => {
      const existing = strictMapGet(elMap, id)

      root.prependChild(existing)
    })
  }

  const toEnd = (ids: string[]) => {
    sortIds(elMap, ids).forEach(id => {
      const existing = strictMapGet(elMap, id)

      root.appendChild(existing)
    })
  }

  const forward = (ids: string[]) => {
    sortIds(elMap, ids).forEach(id => {
      const existing = strictMapGet(elMap, id)

      if (existing.nextSibling) {
        root.insertAfter(existing, existing.nextSibling)
      }
    })
  }

  const back = (ids: string[]) => {
    sortIds(elMap, ids).reverse().forEach(id => {
      const existing = strictMapGet(elMap, id)

      if (existing.previousSibling) {
        root.insertBefore(existing, existing.previousSibling)
      }
    })
  }

  return { toStart, toEnd, forward, back }
}

const sortIds = <T extends ID>(
  elMap: Map<string, TreeNode<T>>,
  ids: string[]
) =>
  ids.sort((a, b) => {
    const nodeA = strictMapGet(elMap, a)
    const nodeB = strictMapGet(elMap, b)

    return nodeA.index - nodeB.index
  })
