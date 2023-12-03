import { RuleArguments, RuleContext, createFieldRule } from "@/plugins"
import { PLUGIN_NAME, ValidationTestResult } from "./plugin"

/**
 * Requires the field to have a value.
 */
export const required = createValidationRule((context) => ({
  setRequiredFlag: true,
  errorMessage:
    (context.value !== null && context.value !== "") ||
    "This field is required",
}))

/**
 * Requires the field to have a value if the given test passes.
 */
export const requiredIf = createValidationRule<() => boolean>(
  (context, test) => {
    const isRequired = test(context)
    const hasValue = context.value != null && context.value !== ""

    return {
      setRequiredFlag: isRequired,
      errorMessage: !isRequired || hasValue || "This field is required",
    }
  }
)

/**
 * Requires the value to have the given minimum length.
 */
export const minLength = createValidationRule<number>(
  (context, length) =>
    (typeof context.value === "string" && context.value.length >= length) ||
    `Must be at least ${length} characters long`
)

/**
 * Requires the value to be equal to the value of the given field.
 */
export const mustBeEqualToField = createValidationRule<string>(
  ({ form, value }, fieldName) =>
    value === form.fields[fieldName].value ||
    `Must be equal to "${form.fields[fieldName].value}"`
)

type ValidIfArgs = {
  validIf: boolean
  errorMessage: string
}

/**
 * Runs any given validation rule, with any given error message to return if the rule fails.
 */
export const validIf = createValidationRule<() => ValidIfArgs>(
  (context, args) => {
    const argsResult = args(context)

    return argsResult.validIf || argsResult.errorMessage
  }
)

/**
 * A helper function for creating validation rules.
 *
 * @param execute Executes the rule. Should return `null` if the field is valid,
 * or an error message if it is not. See docs on {@linkcode createFieldRule} for
 * details on how to work with the `TArgs` argument.
 *
 * @returns A validation rule.
 */
export function createValidationRule<TArgs>(
  execute: (
    context: RuleContext,
    args: RuleArguments<TArgs>
  ) => ValidationTestResult
) {
  return createFieldRule<TArgs, ValidationTestResult>(
    PLUGIN_NAME,
    (context, args) => execute(context, args)
  )
}
