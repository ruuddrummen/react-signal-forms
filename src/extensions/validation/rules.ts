import { FieldRuleFunction, RuleArguments, RuleContext } from "../types"
import {
  EXTENSION_NAME,
  ValidationFieldRule,
  ValidationTestResult,
} from "./extension"

/**
 * Returns an error if the field has no value.
 */
export const required = createValidationRule((context) =>
  context.value !== null && context.value !== ""
    ? null
    : "This field is required"
)

/**
 * Returns an error if the test succeeds and the field has no value.
 */
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

export const mustBeEqualToField = createValidationRule<string>(
  ({ form, value }, fieldName) =>
    value === form.fields[fieldName].value
      ? null
      : `Must be equal to "${form.fields[fieldName].value}"`
)

type ValidIfArgs = {
  testResult: boolean
  errorMessage: string
}

/**
 * Runs any given validation rule, with any given error message to return if the rule fails.
 */
export const validIf = createValidationRule<() => ValidIfArgs>(
  (context, args) => {
    const argsResult = args(context)

    return argsResult.testResult ? null : argsResult.errorMessage
  }
)

/**
 * Creates a validation rule function which can be used in the
 * `createFields` field builders.
 * @param execute Executes the rule. Should return `null` if the
 * field is valid, or an error message if it is not.
 * @template TArgs The type of the arguments when using the rule.
 * Can be `void`, `T` or `() => T` for any `T`. Default is `void`.
 *
 * If set to `void`, the rule can be used without arguments, such as `required()`.
 *
 * If set to `T` it can be used as `rule(args: T)`, such as `minLength(6)`.
 *
 * If set to `() => T` it can be used as `rule(ruleContext => T)`,
 * where `ruleContext` describes form and field states. For example: `requiredIf(context => boolean)`.
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
