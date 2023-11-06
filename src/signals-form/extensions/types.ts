import { IFieldContext } from "../fieldContext";

export interface SignalFormExtension<TFieldContext = any> {
  extendFieldContext: (fieldContext: IFieldContext) => void;
}

// See: https://stackoverflow.com/questions/71595843/combine-all-types-in-array-into-a-single-type
export type MergeTypes<T extends SignalFormExtension[]> = T extends [
  a: SignalFormExtension<infer A>,
  ...rest: infer R
]
  ? R extends SignalFormExtension[]
    ? A & MergeTypes<R>
    : never
  : {};
