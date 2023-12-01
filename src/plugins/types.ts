import { IFormContextLike } from "@/formContext"
import { Field, FieldRule, IFieldContext, IFormContext } from "@/index"
import { FormValues } from "@/types"
import { KeyOf } from "@/utils"

/**
 * Base type for extensions to field signals.
 */
export type FieldContextExtension = Record<string, unknown>
export type FieldContextExtensions = Record<string, FieldContextExtension>

/**
 * Base type for context properties.
 */
export type ContextProperties = Record<string, unknown>

/**
 * Interface for describing a signal form plugin.
 */
export interface SignalFormPlugin<
  TFieldContextExtension extends FieldContextExtension = FieldContextExtension,
  TFieldContextProperties extends ContextProperties = ContextProperties,
  TFormContextProperties extends ContextProperties = ContextProperties,
> {
  name: string
  createFieldExtension(
    field: Field,
    formContext: IFormContextLike
  ): TFieldContextExtension
  createFieldProperties?(
    extension: TFieldContextExtension
  ): PropertyDescriptors<TFieldContextProperties>
  createFormProperties?(args: {
    fields: Array<IFieldContext & TFieldContextProperties>
    extensions: TFieldContextExtension[]
  }): PropertyDescriptors<TFormContextProperties>
}

/**
 * Recursively merges the types of the second type parameters, which
 * describes the field context properties.
 **/
type MergeFieldContextProperties<T extends SignalFormPlugin[]> = T extends [
  firstItem: SignalFormPlugin<any, infer X, any>,
  ...rest: infer R,
]
  ? R extends SignalFormPlugin[]
    ? X & MergeFieldContextProperties<R>
    : never
  : {}

/**
 * Recursively merges the types of the third type parameters, which
 * describes the form context properties.
 **/
type MergeFormContextProperties<T extends SignalFormPlugin[]> = T extends [
  firstItem: SignalFormPlugin<any, any, infer X>,
  ...rest: infer R,
]
  ? R extends SignalFormPlugin[]
    ? X & MergeFormContextProperties<R>
    : never
  : {}

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

/**
 * Expands all field properties defined in the given plugins.
 */
export type ExpandFieldContextProperties<T extends SignalFormPlugin[]> = Expand<
  MergeFieldContextProperties<T>
>

/**
 * Expands all form properties defined in the given plugins.
 */
export type ExpandFormContextProperties<T extends SignalFormPlugin[]> = Expand<
  MergeFormContextProperties<T>
>

interface PropertyDescriptor<T> {
  get?(): T
  set?(v: T): void
}

export type PropertyDescriptors<T> = {
  [K in keyof T]: PropertyDescriptor<T[K]>
}

/**
 * Describes the type of a rule functions' arguments.
 * If `TArgs == void` - i.e. the rule has no arguments - returns `void`;
 * if `TArgs` is a function, returns a function with a `RuleContext` parameter;
 * else returns `TArgs`.
 */
export type RuleArguments<
  TArgs,
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
> = void extends TArgs
  ? void
  : TArgs extends () => infer ReturnType
  ? (context: RuleContext<TForm, TKey>) => ReturnType
  : TArgs

export type FieldRuleFunction<TArgs> = <TForm, TKey extends KeyOf<TForm>>(
  args: RuleArguments<TArgs, TForm, TKey>
) => FieldRule<TForm, TKey>

export type RuleContext<
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
> = {
  value: TForm[TKey]
  form: IFormContext<TForm>
}
