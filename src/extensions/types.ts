import { Field, FieldRule } from "../fields";
import { IFormContext } from "../formContext";
import { FormValues } from "../types";
import { KeyOf } from "../utils";

/**
 * Base interface for extensions to field signals.
 */
export type FieldContextExtension = {};
export type FieldContextExtensions = Record<string, FieldContextExtension>;

export type FieldContextProperties = Record<string, unknown>;

/**
 * Interface for describing a signal form extension.
 */
export interface SignalFormExtension<
  TFieldContextExtension extends FieldContextExtension,
  TFieldContextProperties extends FieldContextProperties
> {
  name: string;
  createFieldExtension(
    field: Field,
    formContext: IFormContext
  ): TFieldContextExtension;
  createFieldProperties(
    extension: TFieldContextExtension
  ): PropertyDescriptors<TFieldContextProperties>;
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

/**
 * If TArgs == void - i.e. the rule has no arguments - return void;
 * if TArgs is a function, return a function with rule context parameter;
 * else return TArgs.
 */
export type RuleArguments<
  TArgs,
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = void extends TArgs
  ? void
  : TArgs extends () => infer ReturnType
  ? (context: RuleContext<TForm, TKey>) => ReturnType
  : TArgs;

export type FieldRuleFunction<TArgs> = <TForm, TKey extends KeyOf<TForm>>(
  args: RuleArguments<TArgs, TForm, TKey>
) => FieldRule<TForm, TKey>;

export type RuleContext<
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = {
  value: TForm[TKey];
  form: IFormContext<TForm>;
};
