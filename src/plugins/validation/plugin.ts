import { isArrayFieldContext } from "@/arrays/fieldContext"
import { isArrayField } from "@/fields"
import { Field, FieldRule, IFormContext } from "@/index"
import { RuleContext } from "@/plugins"
import { createPlugin } from "@/plugins/create"
import { FormValues } from "@/types"
import { KeyOf, arrayEquals } from "@/utils"
import { Signal, computed, signal } from "@preact/signals-react"

export const PLUGIN_NAME = "validation"

/**
 * Adds validation rule handling and field signals.
 *
 * **Note:** if a field has value `undefined`, it is considered not applicable
 * and exempt from all validation rules.
 */
export const validationRulesPlugin = createPlugin(PLUGIN_NAME, {
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
})

type ValidationFieldExtension = {
  errorsSignal: Signal<string[]>
  isRequiredSignal: Signal<boolean>
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
  // Cast form context to include validation properties.
  const validationFormContext = formContext as IFormContext<
    FormValues,
    [typeof validationRulesPlugin]
  >

  const fieldContext = validationFormContext.fields[field.name]
  const validationRules = field.rules?.filter(isValidationRule) ?? []

  if (validationRules.length === 0 && !isArrayField(field)) {
    return defaultContextExtension
  }

  let previousErrors: string[] = []

  const validationResults = computed(() => {
    const results = validationRules.map((r) =>
      r.execute({ value: fieldContext.value, form: formContext })
    )

    if (isArrayFieldContext(fieldContext)) {
      const allItemsAreValid = fieldContext.arrayItems.value.every((item) =>
        Object.values(item.fields).every((field) => field.isValid)
      )

      if (!allItemsAreValid) {
        results.push("Not all array items are valid")
      }
    }
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

      // Return the previous reference if errors have not changed.
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
    } else if (
      typeof result === "object" &&
      typeof result?.errorMessage === "string"
    ) {
      errors.push(result.errorMessage)
    }

    return errors
  }, [])
}

function isValidationRule(rule: FieldRule): rule is ValidationFieldRule {
  return rule.plugin === PLUGIN_NAME
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
 * a field is invalid. Can also be an object to include whether
 * the field should be marked as `required`. If the error message
 * is set to `null` or `true` the field is considered valid.
 */
export type ValidationTestResult =
  | string
  | ValidationTestResultObject
  | null
  | true

type ValidationTestResultObject = {
  errorMessage: string | null | true
  setRequiredFlag: boolean
}
