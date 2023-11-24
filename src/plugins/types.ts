import { IFieldContext } from "../fieldContext"
import { Field, FieldRule } from "../fields"
import { IFormContext } from "../formContext"
import { FormValues } from "../types"
import { KeyOf } from "../utils"

/**
 * Base interface for extensions to field signals.
 */
export type FieldContextExtension = {}
export type FieldContextExtensions = Record<string, FieldContextExtension>

export type ContextProperties = Record<string, unknown>

/**
 * Interface for describing a signal form extension.
 */
export interface SignalFormExtension<
  TFieldContextExtension extends FieldContextExtension,
  TFieldContextProperties extends ContextProperties,
  TFormContextProperties extends ContextProperties,
> {
  name: string
  createFieldExtension(
    field: Field,
    formContext: IFormContext
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
 * Creates a plugin.
 * @param name The name of the plugin.
 * @param args Methods to extend forms and fields.
 * @returns A plugin.
 */
export function createPlugin<
  TFieldContextExtension extends FieldContextExtension,
  TFieldContextProperties extends ContextProperties,
  TFormContextProperties extends ContextProperties,
>(
  name: string,
  args: {
    /**
     * Adds an extension to the context of the given field. This extension can
     * be used by properties on forms and fields, and cannot be accessed
     * directly by users.
     * @param field The field.
     * @param formContext The form context.
     */
    createFieldExtension(
      field: Field,
      formContext: IFormContext
    ): TFieldContextExtension

    /**
     * Adds properties to a field given the extension created by
     * `createFieldExtension(...)`. These properties can be accessed by calling
     * `useFieldSignals(field)`.
     * @param extension The extension created by `createFieldExtension(...)`.
     */
    createFieldProperties?(
      extension: TFieldContextExtension
    ): PropertyDescriptors<TFieldContextProperties>

    /**
     * Adds prpoerties to a form given all fields contexts and extensions in the form.
     * @param args
     */
    createFormProperties?(args: {
      /**
       * All field contexts in the form.
       */
      fields: Array<IFieldContext & TFieldContextProperties>

      /**
       * All field extensions in the form.
       */
      extensions: TFieldContextExtension[]
    }): PropertyDescriptors<TFormContextProperties>
  }
): SignalFormExtension<
  TFieldContextExtension,
  TFieldContextProperties,
  TFormContextProperties
> {
  return {
    name,
    ...args,
  }
}

/**
 * Recursively merges the types of the second type parameters, which
 * describes the field context properties.
 **/
type MergeFieldContextProperties<
  T extends SignalFormExtension<any, any, any>[],
> = T extends [
  firstItem: SignalFormExtension<any, infer X, any>,
  ...rest: infer R,
]
  ? R extends SignalFormExtension<any, any, any>[]
    ? X & MergeFieldContextProperties<R>
    : never
  : {}

/**
 * Recursively merges the types of the third type parameters, which
 * describes the form context properties.
 **/
type MergeFormContextProperties<
  T extends SignalFormExtension<any, any, any>[],
> = T extends [
  firstItem: SignalFormExtension<any, any, infer X>,
  ...rest: infer R,
]
  ? R extends SignalFormExtension<any, any, any>[]
    ? X & MergeFormContextProperties<R>
    : never
  : {}

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type ExpandFieldContextProperties<
  T extends SignalFormExtension<any, any, any>[],
> = Expand<MergeFieldContextProperties<T>>

export type ExpandFormContextProperties<
  T extends SignalFormExtension<any, any, any>[],
> = Expand<MergeFormContextProperties<T>>

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