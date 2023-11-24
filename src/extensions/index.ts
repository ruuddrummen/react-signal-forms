import { applicabilityRulesPlugin } from "./applicabilityRules/plugin"
import { diffChangesExtension } from "./planned/diffChanges"
import { touchedFieldsExtension } from "./touchedFields"
import { validationRulesPlugin } from "./validation/plugin"

export const defaultExtensions = [
  validationRulesPlugin,
  touchedFieldsExtension,
] as const

export const extensions = {
  applicabilityRules: applicabilityRulesPlugin,
  validationRules: validationRulesPlugin,
  touchedFields: touchedFieldsExtension,
  diffChanges: diffChangesExtension, // planned
}
