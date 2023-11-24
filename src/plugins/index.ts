import { applicabilityRulesPlugin } from "./applicabilityRules/plugin"
import { diffChangesExtension } from "./planned/diffChanges"
import { touchedFieldsExtension } from "./touchedFields"
import { validationRulesPlugin } from "./validation/plugin"

export const defaultPlugins = [
  validationRulesPlugin,
  touchedFieldsExtension,
] as const

export const plugins = {
  applicabilityRules: applicabilityRulesPlugin,
  validationRules: validationRulesPlugin,
  touchedFields: touchedFieldsExtension,
  diffChanges: diffChangesExtension, // planned
}
