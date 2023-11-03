import { Signal } from "@preact/signals-react";

export function patch<TSignal>(signal: Signal<TSignal>, update: Partial<TSignal>) {
  signal.value = {
    ...signal.value,
    ...update,
  };
}
