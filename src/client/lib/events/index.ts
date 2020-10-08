import { Disposable, Listener, TypedEventEmitter } from './types'

export const createEmitter = <T>(): TypedEventEmitter<T> => {
  const listeners: Listener<T>[] = []
  let onces: Listener<T>[] = []

  const on = (listener: Listener<T>): Disposable => {
    listeners.push(listener)

    return {
      dispose: () => off(listener)
    }
  }

  const once = (listener: Listener<T>) => {
    onces.push(listener)
  }

  const off = (listener: Listener<T>) => {
    const callbackIndex = listeners.indexOf(listener)

    if (callbackIndex > -1) listeners.splice(callbackIndex, 1)
  }

  const emit = (event: T) => {
    listeners.forEach(listener => listener(event))

    if (onces.length > 0) {
      const existing = onces

      onces = []

      existing.forEach(listener => listener(event))
    }
  }

  return { on, once, off, emit }
} 
