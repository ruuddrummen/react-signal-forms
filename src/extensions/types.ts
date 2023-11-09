import { Field } from "../fields";
import { IFormContext } from "../formContext";

export interface FieldContextExtension {}

export type FieldContextExtensions = {
  [name: string]: FieldContextExtension;
};

export interface SignalFormExtension<
  TFieldContextExtension extends FieldContextExtension,
  TFieldContextProperties
> {
  name: string;
  createFieldExtension: (
    field: Field,
    formContext: IFormContext
  ) => TFieldContextExtension;
  createFieldProperties: (
    extension: TFieldContextExtension
  ) => PropertyDescriptors<TFieldContextProperties>;
}

// Recursively merge the types of the second type parameters, which describes the field context properties.
type MergeFieldContextProperties<T extends SignalFormExtension<any, any>[]> =
  T extends [firstItem: SignalFormExtension<any, infer B>, ...rest: infer R]
    ? R extends SignalFormExtension<any, any>[]
      ? B & MergeFieldContextProperties<R>
      : never
    : {};

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type ExpandFieldContextProperties<
  T extends SignalFormExtension<any, any>[]
> = Expand<MergeFieldContextProperties<T>>;

interface PropertyDescriptor<T> {
  get?(): T;
  set?(v: T): void;
}

export type PropertyDescriptors<T> = {
  [K in keyof T]: PropertyDescriptor<T[K]>;
};
