import { TreeNode, createNode } from '@mojule/tree-node'
import { assertUnique, strictMapGet } from '../util'
import { ID, CollectionTasks, Update, OrderCommand } from './types'

// tasks do work and return info needed to create a command for undo/redo
export const createTasks = <T extends ID>(
  elMap: Map<string, TreeNode<T>>,
  root: TreeNode<T>
): CollectionTasks<T> => {
  const addOne = (element: T): T => {
    assertUnique(elMap, element.id)

    const node = createNode(element)

    root.appendChild(node)
    elMap.set(element.id, node)

    return element
  }

  const removeOne = (id: string): T => {
    const node = strictMapGet(elMap, id)

    node.remove()
    elMap.delete(id)

    return node.value
  }

  const updateOne = (element: T): Update<T> => {
    const node = strictMapGet(elMap, element.id)
    const prev = node.value

    node.value = element

    return { prev, value: element }
  }

  const setOrder = (ids: string[]): OrderCommand => {
    const before = root.childNodes.map(n => n.value.id)

    if (ids.length !== before.length)
      throw Error(`Expected ${before.length} ids`)

    ids.forEach(id => {
      const existing = strictMapGet(elMap, id)

      root.appendChild(existing)
    })

    return { type: 'order', before, after: ids }
  }

  return { addOne, removeOne, updateOne, setOrder }
}