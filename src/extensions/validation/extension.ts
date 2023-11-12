import { Signal, computed, signal } from "@preact/signals-react"
import { Field, FieldRule } from "../../fields"
import { IFormContext } from "../../formContext"
import { FormValues } from "../../types"
import { KeyOf } from "../../utils"
import { RuleContext, SignalFormExtension } from "../types"

export const EXTENSION_NAME = "validation"

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
export const validationRulesExtension: SignalFormExtension<
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
        get: () => extension.errorsSignal.value.length === 0,
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

function isValidationRule(rule: FieldRule): rule is ValidationFieldRule {
  return rule.extension === EXTENSION_NAME
}

export interface ValidationFieldRule<
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
export type ValidationTestResult = null | string