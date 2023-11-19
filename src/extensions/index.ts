import { applicabilityRulesExtension } from "./applicabilityRules/extension"
import { diffChangesExtension } from "./planned/diffChanges"
import { touchedFieldsExtension } from "./touchedFields"
import { validationRulesExtension } from "./validation/extension"

export const defaultExtensions = [
  validationRulesExtension,
  touchedFieldsExtension,
] as const

export const extensions = {
  applicabilityRules: applicabilityRulesExtension,
  validationRules: validationRulesExtension,
  touchedFields: touchedFieldsExtension,
  diffChanges: diffChangesExtension, // planned
}
