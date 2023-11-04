import { useEffect, useRef } from "react";

export function forAllKeysOf<T extends {}>(
  obj: T,
  test: (key: keyof T) => boolean
): boolean {
  return Object.keys(obj).every((key) => test(key as any));
}

export function forEachKeyOf<T extends {}>(
  obj: T,
  action: (key: keyof T) => void
): void {
  Object.keys(obj).forEach((key) => action(key as any));
}

export function arrayToObject<
  TObject,
  TArray,
  TKey extends keyof TObject = keyof TObject
>(
  array: Array<TArray>,
  toKey: (item: TArray) => TKey,
  toValue: (item: TArray) => TObject[TKey]
): TObject {
  throw new Error();
}

export const arrayToObject2: <TArray>(
  array: Array<TArray>
) => <TObject, TKey extends keyof TObject = keyof TObject>(
  toKey: (item: TArray) => TKey,
  toValue: (item: TArray) => TObject[TKey]
) => TObject = (array) => (toKey, toValue) => {
  throw new Error();
};

export function areEqualish(val1: any, val2: any) {
  if (val1 == null && val2 == null) {
    return true;
  }

  return val1 === val2;
}

export function ensureNotNull<T>(
  name: string,
  value: T
): value is Exclude<T, null | undefined> {
  if (value == null) {
    throw new Error(`${name} should not be null.`);
  }

  return value != null;
}

export const useRenderCount = () => {
  const count = useRef(0);

  useEffect(() => {
    count.current++;
  });

  return count;
};

export type KeyOf<TForm> = keyof TForm & string;
