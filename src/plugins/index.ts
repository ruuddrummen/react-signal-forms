import { applicabilityRulesPlugin } from "./applicabilityRules/plugin"
import { diffChangesExtension } from "./planned/diffChanges"
import { touchedFieldsPlugin } from "./touchedFields"
import { validationRulesPlugin } from "./validation/plugin"

export const defaultPlugins = [
  validationRulesPlugin,
  touchedFieldsPlugin,
] as const

export const plugins = {
  applicabilityRules: applicabilityRulesPlugin,
  validationRules: validationRulesPlugin,
  touchedFields: touchedFieldsPlugin,
  diffChanges: diffChangesExtension, // planned
}
