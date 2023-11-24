import { areEqualish, forAllKeysOf } from "@/utils"
import { Signal } from "@preact/signals-react"

export function patch<T extends {}>(signal: Signal<T>, update: Partial<T>) {
  if (typeof update !== "object") {
    throw new Error("Only use patch for updating object signals.")
  }

  if (
    forAllKeysOf(update, (key) => areEqualish(signal.value[key], update[key]))
  ) {
    // Nothing changed.
    return
  }

  signal.value = {
    ...signal.value,
    ...update,
  }
}
