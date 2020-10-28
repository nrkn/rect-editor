import { StrKey } from './state/types'

export const randomId = () =>
  createSequence(16, randomChar).join('')

export const randomChar = () => String.fromCharCode(randomInt(26) + 97)

export const randomInt = (exclMax: number) =>
  Math.floor(Math.random() * exclMax)

export const createSequence = <T>(
  length: number, cb: (index: number) => T
) =>
  Array.from({ length }, (_v, index) => cb(index))

export const clone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value))

export const strictValue = <T, K extends StrKey<T> = StrKey<T>>(
  record: Partial<T>, key: K
): T[K] => {
  const value = record[key]

  if (value === undefined) throw Error(`Expected ${key}`)

  return value as T[K]
}

export const getKeys = <T, K extends StrKey<T> = StrKey<T>>(
  value: T
) => Object.keys(value) as K[]

export const typedReducer = <T, K extends StrKey<T> = StrKey<T>>(
  keys: K[],
  reduce: (key: K) => T[K]
) =>
  keys.reduce(
    (target, key) => {
      target[key] = reduce(key)

      return target
    },
    {} as T
  )

export const assertUnique = <T>(map: Map<T, any>, key: T) => {
  if (map.has(key))
    throw Error(`Duplicate key ${key}`)
}

export const strictMapGet = <T, K>(map: Map<K, T>, key: K) => {
  const existing = map.get(key)

  if (existing === undefined)
    throw Error(`Expected key ${key}`)

  return existing
}
