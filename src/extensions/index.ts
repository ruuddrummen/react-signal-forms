import { applicabilityRulesExtension } from "./applicabilityRules/extension"
import { diffChangesExtension } from "./planned/diffChanges"
import { touchedFieldsExtension } from "./touchedFields"
import { validationRulesPlugin } from "./validation/plugin"

export const defaultExtensions = [
  validationRulesPlugin,
  touchedFieldsExtension,
] as const

export const extensions = {
  applicabilityRules: applicabilityRulesExtension,
  validationRules: validationRulesPlugin,
  touchedFields: touchedFieldsExtension,
  diffChanges: diffChangesExtension, // planned
}
