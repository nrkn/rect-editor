export const randomId = () =>
  createSequence(16, randomChar).join('')

export const randomChar = () => String.fromCharCode(randomInt(26) + 97)

export const randomInt = (exclMax: number) =>
  Math.floor(Math.random() * exclMax)

export const createSequence = <T>(
  length: number, cb: (index: number) => T
) =>
  Array.from({ length }, (_v, index) => cb(index))

export const strictMapGet = <T, K>(map: Map<K, T>, key: K) => {
  const existing = map.get(key)

  if (existing === undefined)
    throw Error(`Expected key ${key}`)

  return existing
}

export const assertUnique = <T>(map: Map<T, any>, key: T) => {
  if (map.has(key))
    throw Error(`Duplicate key ${key}`)
}

export const clone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value))
