import { Signal } from "@preact/signals-react";

export function patch<T extends {}>(signal: Signal<T>, update: Partial<T>) {
  if (typeof update === "object") {
    if (
      forAllKeysOf(update, (key) => areEqualish(signal.value[key], update[key]))
    ) {
      // Nothing changed.
      return;
    }
  }

  signal.value = {
    ...signal.value,
    ...update,
  };
}

function forAllKeysOf<T extends {}>(
  obj: T,
  test: (key: keyof T) => boolean
): boolean {
  return Object.keys(obj).every((key) => test(key as any));
}

function areEqualish(val1: any, val2: any) {
  if (val1 == null && val2 == null) {
    return true;
  }

  return val1 === val2;
}
