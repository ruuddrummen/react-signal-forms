import {
  FieldRuleFunction,
  FieldRuleInternal,
  RuleArguments,
  RuleContext,
} from "./types"

/**
 * Creates a field rule function which can be used in the `createFields` field
 * builders to specify rules on fields. In your plugin you can find and run the
 * rule by asserting the rule type to {@linkcode FieldRuleInternal<TResult>}
 * with the `pluginName` property and running the `execute` method on it.
 *
 * @param execute Executes the rule. With given {@linkcode RuleContext} and the
 * input arguments of type `TArgs` this method should return the result of the
 * rule with type `TResult`.
 *
 * @template TArgs The type of the arguments when using the rule in the
 * `fieldBuilder`. Can be `void`, `T` or `() => T` for any `T`.
 *
 * - If set to `void`, the rule can be used without arguments, such as
 *   `required()`.
 *
 * - If set to `T` it can be used as `rule(args: T)`, such as `minLength(6)`.
 *
 * - If set to `() => T` it can be used as `rule(fn: RuleContext => T)`, such
 *   as:
 *
 * ```
 * requiredIf(context => context.form.fields.otherField.value === "some value")
 * ```
 *
 * `T` can also be a token:
 * - Use `() => FieldValueType` to describe a function which returns the field
 *   value type.
 *
 * @template TResult The return type of the rule.
 *
 * @returns A rule ready to be used in field builders.
 */
export function createFieldRule<TArgs, TResult>(
  pluginName: string,
  execute: (context: RuleContext, args: RuleArguments<TArgs>) => TResult
): FieldRuleFunction<TArgs> {
  const ruleFn = (args: RuleArguments<TArgs>) =>
    ({
      pluginName,
      execute: (field, formContext) => {
        const value = formContext.fields[field.name].value

        return execute({ form: formContext, value }, args)
      },
    }) as FieldRuleInternal<TResult>

  return ruleFn as FieldRuleFunction<TArgs>
}
