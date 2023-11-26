export type KeyOf<TForm> = keyof TForm & string

export function forAllKeysOf<T extends {}>(
  obj: T,
  test: (key: KeyOf<T>) => boolean
): boolean {
  return Object.keys(obj).every((key) => test(key as any))
}

export function KeysOf<T extends {}>(obj: T): Array<KeyOf<T>> {
  return Object.keys(obj) as Array<KeyOf<T>>
}

export function forEachKeyOf<T extends {}>(
  obj: T,
  action: (key: KeyOf<T>) => void
): void {
  Object.keys(obj).forEach((key) => action(key as any))
}

export function areEqualish(val1: any, val2: any) {
  if (val1 == null && val2 == null) {
    return true
  }

  return val1 === val2
}

export function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

export function ensureNotNull<T>(
  name: string,
  value: T
): value is Exclude<T, null | undefined> {
  if (value == null) {
    throw new Error(`${name} should not be null.`)
  }

  return value != null
}
