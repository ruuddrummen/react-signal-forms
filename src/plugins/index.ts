import { applicabilityRulesPlugin } from "./applicabilityRules/plugin"
import { diffChangesPlugin } from "./planned/diffChanges"
import { readonlyRulesPlugin } from "./readonlyRules/plugin"
import { touchedFieldsPlugin } from "./touchedFields/plugin"
import { validationRulesPlugin } from "./validation/plugin"

export { createFieldRule } from "./createFieldRule"
export { createPlugin } from "./createPlugin"

export const defaultPlugins = [
  validationRulesPlugin,
  touchedFieldsPlugin,
] as const

export const plugins = {
  applicabilityRules: applicabilityRulesPlugin,
  validationRules: validationRulesPlugin,
  touchedFields: touchedFieldsPlugin,
  readonlyRules: readonlyRulesPlugin,
  diffChanges: diffChangesPlugin, // planned
}

export type {
  FieldRuleFunction,
  FieldRuleInternal,
  PropertyDescriptors,
  RuleArguments,
  RuleContext,
} from "./types"
