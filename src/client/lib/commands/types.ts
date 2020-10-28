export type Command<TElement, TTypes> = {
  type: TTypes
  elements: TElement[]
}

export type CommandList<TElement = any, TTypes = string> = {
  list: Command<TElement, TTypes>[]
  nextIndex: number
}
