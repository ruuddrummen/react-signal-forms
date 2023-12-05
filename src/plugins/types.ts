import { Field, FieldRule } from "@/fields"
import { IFormContextLike } from "@/formContext"
import { IFieldContext } from "@/index"
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
type MergeFieldContextProperties<
  T extends SignalFormPlugin[],
  TFieldValue,
> = T extends [
  firstItem: SignalFormPlugin<any, infer TProperties, any>,
  ...rest: infer R,
]
  ? R extends SignalFormPlugin[]
    ? ReplaceTokensInObject<TProperties, TFieldValue> &
        MergeFieldContextProperties<R, TFieldValue>
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
export type ExpandFieldContextProperties<
  TPlugin extends SignalFormPlugin[],
  TFieldValue,
> = Expand<MergeFieldContextProperties<TPlugin, TFieldValue>>

/**
 * Expands all form properties defined in the given plugins.
 */
export type ExpandFormContextProperties<T extends SignalFormPlugin[]> = Expand<
  MergeFormContextProperties<T>
>

/**
 * Gets the field extension type defined in the given plugin.
 */
export type FieldExtension<TPlugin extends SignalFormPlugin> =
  TPlugin extends SignalFormPlugin<infer R, any, any> ? R : never

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
  Key extends KeyOf<TForm> = KeyOf<TForm>,
  TParentForm extends IFormContextLike = any,
> = void extends TArgs
  ? void
  : TArgs extends () => infer ReturnType
  ? (
      context: RuleContext<TForm, Key, TParentForm>
    ) => ReplaceTokens<ReturnType, TForm[Key]>
  : ReplaceTokens<TArgs, TForm[Key]>

export type FieldRuleFunction<TArgs> = <
  TForm,
  TKey extends KeyOf<TForm>,
  TParentForm extends IFormContextLike,
>(
  args: RuleArguments<TArgs, TForm, TKey, TParentForm>
) => FieldRule<TForm, TKey, TParentForm>

export type RuleContext<
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
  TParentForm extends IFormContextLike = any,
> = {
  value: TForm[TKey]
  form: IFormContextLike<TForm, TParentForm>
}

/**
 * The internal type for field rules which can be used by plugins to run them.
 */
export interface FieldRuleInternal<TResult> extends FieldRule {
  execute: (field: Field, formContext: IFormContextLike) => TResult
}

/**
 * A token to refer to the field value type. Currently supports:
 * - `TArgs` in `createFieldRule` with `() => FieldValueType`
 * - Property descriptors in `createPlugin.createFieldProperties`. Example:
 *   ```
 *   { prop: () => _something_ as FieldValueType }
 *   ```
 */
export type FieldValueType = "token:field-value-type"

type ReplaceTokensInObject<TProperties, TFieldValue> = {
  [key in keyof TProperties]: ReplaceTokens<TProperties[key], TFieldValue>
}

type ReplaceTokens<T, TFieldValue> = FieldValueType extends T ? TFieldValue : T
