import { Signal, computed, signal } from "@preact/signals-react"
import { IFieldContext } from "../../fieldContext"
import { Field, FieldRule } from "../../fields"
import { IFormContext } from "../../formContext"
import { FormValues } from "../../types"
import { KeyOf, arrayEquals } from "../../utils"
import { RuleContext, SignalFormExtension } from "../types"

export const EXTENSION_NAME = "validation"

type ValidationFieldExtension = {
  errorsSignal: Signal<string[]>
  isRequiredSignal: Signal<boolean>
}

export type ValidationFieldProperties = {
  isValid: boolean
  errors: string[]
  isRequired: boolean
}

type ValidationFormProperties = {
  isValid: boolean
  invalidFields: Array<IFieldContext & ValidationFieldProperties>
}

/**
 * Adds validation rule handling and field signals.
 *
 * **Note:** if a field has value `undefined`, it is considered not applicable
 * and exempt from all validation rules.
 */
export const validationRulesExtension: SignalFormExtension<
  ValidationFieldExtension,
  ValidationFieldProperties,
  ValidationFormProperties
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
      isRequired: {
        get: () => extension.isRequiredSignal.value,
      },
    }
  },
  createFormProperties({ fields }) {
    return {
      isValid: {
        get: () => fields.every((f) => f.isValid),
      },
      invalidFields: {
        get: () => fields.filter((f) => !f.isValid),
      },
    }
  },
}

const defaultContextExtension: ValidationFieldExtension = {
  errorsSignal: signal([]),
  isRequiredSignal: signal(false),
}

const emptyResults: string[] = []

function createFieldExtension(
  field: Field,
  formContext: IFormContext
): ValidationFieldExtension {
  const fieldContext = formContext.fields[field.name]
  const rules = (field.rules?.filter(isValidationRule) ??
    []) as ValidationFieldRule[]

  if (rules.length === 0) {
    return defaultContextExtension
  }

  let previousErrors: string[] = []

  const validationResults = computed(() => {
    console.log(`(${field.name}) Checking validation rules`)

    // Rules must be executed to create subscriptions on the necessary signals.
    const results = rules.map((r) =>
      r.execute({ value: fieldContext.value, form: formContext })
    )

    // If value is undefined results are not applicable.
    if (fieldContext.peekValue() === undefined) {
      return emptyResults
    }

    return results
  })

  return {
    errorsSignal: computed(() => {
      const errors = getErrorsFromResults(validationResults.value)

      if (errors.length === 0) {
        return emptyResults
      }

      if (arrayEquals(errors, previousErrors)) {
        return previousErrors
      }

      previousErrors = errors
      return errors
    }),
    isRequiredSignal: computed(() =>
      validationResults.value.some(
        (r) => typeof r === "object" && r?.setRequiredFlag === true
      )
    ),
  }
}

function getErrorsFromResults(results: ValidationTestResult[]) {
  return results.reduce<string[]>((errors, result) => {
    if (typeof result === "string") {
      errors.push(result)
    }

    if (
      typeof result === "object" &&
      typeof result?.errorMessage === "string"
    ) {
      errors.push(result.errorMessage)
    }

    return errors
  }, [])
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
 * a field is invalid. If `null` or `false` are returned the field
 * is considered valid.
 */
export type ValidationTestResult =
  | string
  | ValidationTestResultObject
  | null
  | false

type ValidationTestResultObject = {
  errorMessage: string | null | false
  setRequiredFlag: boolean
}
