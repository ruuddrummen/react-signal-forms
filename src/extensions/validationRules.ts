import { Signal, computed, signal } from "@preact/signals-react"
import { Field, FieldRule } from "../fields"
import { IFormContext } from "../formContext"
import { FormValues } from "../types"
import { KeyOf } from "../utils"
import {
  FieldRuleFunction,
  RuleArguments,
  RuleContext,
  SignalFormExtension,
} from "./types"

const EXTENSION_NAME = "validation"

type ValidationFieldContextExtension = {
  errorsSignal: Signal<string[]>
}

type ValidationFieldContextProperties = {
  isValid: boolean
  errors: string[]
}

/**
 * Adds validation rule handling and field signals.
 */
export const validationRules: SignalFormExtension<
  ValidationFieldContextExtension,
  ValidationFieldContextProperties
> = {
  name: EXTENSION_NAME,
  createFieldExtension(field, formContext) {
    return createFieldExtension(field, formContext)
  },
  createFieldProperties(extension) {
    return {
      isValid: {
        get: () => extension.errorsSignal.value.length > 0,
      },
      errors: {
        get: () => extension.errorsSignal.value,
      },
    }
  },
}

const defaultContextExtension: ValidationFieldContextExtension = {
  errorsSignal: signal([]),
}

const emptyErrors: string[] = []

function createFieldExtension(
  field: Field,
  formContext: IFormContext
): ValidationFieldContextExtension {
  const fieldContext = formContext.fields[field.name]
  const rules = (field.rules?.filter(isValidationRule) ??
    []) as ValidationFieldRule[]

  if (rules.length === 0) {
    return defaultContextExtension
  }

  return {
    errorsSignal: computed(() => {
      console.log(`(${field.name}) Checking validation rules`)

      const results = rules.map((r) =>
        r.execute({ value: fieldContext.value, form: formContext })
      )

      const errors = results.filter((e) => typeof e === "string") as string[]

      return errors.length > 0 ? errors : emptyErrors
    }),
  }
}

/**
 * Creates a validation rule function, which can be used in the
 * `createFields` field builders.
 * @param execute Executes the rule. Should return null if the
 * field is valid, or an error message if it is not.
 * @template TArgs The type of the arguments when using the rule.
 * Can be `void`, `T` or `() => T` for any `T`. Default is `void`.
 * @returns A validation rule function.
 */
export function createValidationRule<TArgs = void>(
  execute: (
    context: RuleContext,
    args: RuleArguments<TArgs>
  ) => ValidationTestResult
): FieldRuleFunction<TArgs> {
  const result = (args: RuleArguments<TArgs>) =>
    ({
      extension: EXTENSION_NAME,
      execute: (context) => execute(context as any, args as any),
    }) as ValidationFieldRule

  return result as FieldRuleFunction<TArgs>
}

function isValidationRule(rule: FieldRule): rule is ValidationFieldRule {
  return rule.extension === EXTENSION_NAME
}

interface ValidationFieldRule<
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
> extends FieldRule<TForm, TKey> {
  execute: ValidationTest<TForm, TKey>
}

type ValidationTest<TForm, TKey extends KeyOf<TForm>> = (
  context: RuleContext<TForm, TKey>
) => ValidationTestResult

/**
 * Describes a validation result, which is an error message if
 * a field is invalid, or `null` if the field is valid.
 */
type ValidationTestResult = null | string

export const isRequired = createValidationRule((context) =>
  context.value != null && context.value !== ""
    ? null
    : "This field is required"
)

export const requiredIf = createValidationRule<() => boolean>(
  (context, test) =>
    !test(context) || (context.value != null && context.value !== "")
      ? null
      : "This field is required"
)

export const minLength = createValidationRule<number>((context, length) =>
  typeof context.value === "string" && context.value.length >= length
    ? null
    : `Must be at least ${length} characters long`
)

// TODO: Get the field name with intellisense or context.
export const isEqualTo = createValidationRule<string>(
  ({ form, value }, fieldName) =>
    value === form.fields[fieldName].value
      ? null
      : `Must be equal to "${form.fields[fieldName].value}"`
)
