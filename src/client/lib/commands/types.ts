export type CommandList<T> = {
  list: T[]
  nextIndex: number
}

export type Commands<T> = {
  add: (command: T) => void
  nextUndo: () => T | undefined
  nextRedo: () => T | undefined
}
