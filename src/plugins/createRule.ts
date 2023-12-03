import { FieldRule } from ".."
import { FieldRuleFunction, RuleArguments, RuleContext } from "./types"

export function createFieldRule<TArgs, TResult>(
  pluginName: string,
  execute: (context: RuleContext, args: RuleArguments<TArgs>) => TResult
): FieldRuleFunction<TArgs> {
  const ruleFn = (args: RuleArguments<TArgs>) =>
    ({
      plugin: pluginName,
      execute: (context) => execute(context as any, args as any),
    }) as InternalFieldRule<TResult>

  return ruleFn as FieldRuleFunction<TArgs>
}

interface InternalFieldRule<TResult = unknown> extends FieldRule {
  execute: (context: RuleContext) => TResult
}
