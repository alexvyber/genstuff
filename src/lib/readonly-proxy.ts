var ReadOnlyProxyDescriptor = {
  get<T extends object>(target: T, key: keyof T & (string & {})): any {
    var value = target[key]

    if (!isObject(value)) {
      return value
    }

    return readonly(value)
  },

  set(_target: object, _key: string) {
    throw new ReadOnlyProxyWriteError("Cannot write on read-only proxy")
  },

  deleteProperty(_target: object, _key: string) {
    throw new ReadOnlyProxyWriteError("Cannot delete on read-only proxy")
  },
}

function isObject(thing: unknown) {
  return thing !== null && typeof thing === "object"
}

class ReadOnlyProxyWriteError extends Error {
  name = "ReadOnlyProxyWriteError"
}

// Create a read-only proxy over an object.
// Sub-properties that are objects also return read-only proxies.
export function readonly<T extends object>(target: T) {
  return new Proxy<T>(target, ReadOnlyProxyDescriptor)
}
