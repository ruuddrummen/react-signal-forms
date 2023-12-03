import { FieldRule } from ".."
import { FieldRuleFunction, RuleArguments, RuleContext } from "./types"

/**
 * Creates a field rule function which can be used in the `createFields` field
 * builders to specify rules on fields.
 *
 * @param execute Executes the rule. With given {@link RuleContext} and the
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
      plugin: pluginName,
      execute: (context) => execute(context, args),
    }) as FieldRuleInternal<TResult>

  return ruleFn as FieldRuleFunction<TArgs>
}

interface FieldRuleInternal<TResult = unknown> extends FieldRule {
  execute: (context: RuleContext) => TResult
}
