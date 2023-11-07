import { IFieldContext } from "../fieldContext";
import { FieldCollection } from "../fields";
import { IFormContext } from "../formContext";

export interface SignalFormExtension<TFieldContext = any> {
  extendFormContext: (
    fields: FieldCollection,
    formContext: IFormContext
  ) => void;
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

export function extendFieldContext<TFieldContext>(
  fieldContext: IFieldContext,
  property: keyof TFieldContext,
  value: PropertyDescriptor
) {
  Object.defineProperty(fieldContext, property, value);
}
