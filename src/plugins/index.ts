import { applicabilityRulesPlugin } from "./applicabilityRules/plugin"
import { computedValueRulesPlugin } from "./computedValueRules/plugin"
import { initialValuePlugin } from "./initialValue/plugin"
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
  computedValueRules: computedValueRulesPlugin,
  initialValue: initialValuePlugin,
}

export type {
  FieldRuleFunction,
  FieldRuleInternal,
  PropertyDescriptors,
  RuleArguments,
  RuleContext,
} from "./types"
