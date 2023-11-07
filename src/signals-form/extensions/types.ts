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

export type MergeFieldContextProperties<
  T extends SignalFormExtension<any, any>[]
> = T extends [a: SignalFormExtension<any, infer B>, ...rest: infer R]
  ? R extends SignalFormExtension<any, any>[]
    ? B & MergeFieldContextProperties<R>
    : never
  : {};

interface PropertyDescriptor<T> {
  get?(): T;
  set?(v: T): void;
}

export type PropertyDescriptors<T> = {
  [K in keyof T]: PropertyDescriptor<T[K]>;
};
