import { FieldRuleFunction, RuleArguments, RuleContext } from "@/plugins"
import {
  PLUGIN_NAME,
  ValidationFieldRule,
  ValidationTestResult,
} from "./plugin"

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
 * Requires the field to have a value if the given test succeeds.
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
    value === form.fieldSignals[fieldName].value ||
    `Must be equal to "${form.fieldSignals[fieldName].value}"`
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
      plugin: PLUGIN_NAME,
      execute: (context) => execute(context as any, args as any),
    }) as ValidationFieldRule

  return result as FieldRuleFunction<TArgs>
}
